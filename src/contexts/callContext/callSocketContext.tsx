import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Logger from '../../utils/logger'

interface CallSocketContextType {
  selfId?: string
  isCalling?: boolean
  isInCall?: boolean
  makeCall: (targetId: string, videoCall: boolean) => void
  doRejectCall?: () => void
  callerId?: string
  doAnswer?: () => void
  doHangUp?: (fireManually: boolean) => void
  localStream?: MediaStream | null
  remoteStream?: MediaStream | null
}

const WEB_SOCKET_URL = import.meta.env.VITE_REACT_APP_WS_URL || 'ws://localhost:9090'

const CallSocketContext = createContext<CallSocketContextType | null>(null)
const ws = new WebSocket(WEB_SOCKET_URL)

const CallContextProvider = ({ children }: { children: ReactNode }) => {
  const [clientId, setClientId] = useState<string | null>(null)

  const [isInCall, setIsInCall] = useState(false)
  // make call flow
  const [isCalling, setIsCalling] = useState(false)
  const [targetId, setTargetId] = useState('')

  // receive call flow
  const [callerId, setCallerId] = useState('')
  const [callerOffer, setCallerOffer] = useState<RTCSessionDescriptionInit | null>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const [videoCall, setVideoCall] = useState(true)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  const handleNewICECandidate = (candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }

  const handleReceiveOffer = async (
    offer: RTCSessionDescriptionInit,
    from: string,
    isVideoCall: boolean,
  ) => {
    if (peerConnectionRef.current) return

    setCallerId(from)
    setCallerOffer(offer)
    setVideoCall(isVideoCall)
  }

  const handleDoAnswer = async () => {
    const peerConnection = createPeerConnection(callerId)
    peerConnectionRef.current = peerConnection

    await startLocalStream(videoCall)

    if (!callerOffer) {
      alert('No caller offer')
      return
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(callerOffer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    setIsInCall(true)

    ws.send(
      JSON.stringify({
        type: 'answer',
        answer,
        callerId: callerId,
      }),
    )
  }

  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
    }
    setIsInCall(true)
  }

  const _resetStreams = useCallback(() => {
    if (localStream) {
      const tracks = localStream.getTracks()
      tracks.forEach((track) => track.stop())
    }

    if (remoteStream) {
      const tracks = remoteStream.getTracks()
      tracks.forEach((track) => track.stop())
    }

    setLocalStream(null)
    setRemoteStream(null)
  }, [localStream, remoteStream])

  const _resetAll = useCallback(() => {
    _resetStreams()

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    setCallerId('')
    setCallerOffer(null)
    setIsCalling(false)
    setIsInCall(false)
    setTargetId('')
  }, [_resetStreams])

  const makeCall = async (targetId: string, videoCall: boolean) => {
    setTargetId(targetId)
    const peerConnection = createPeerConnection(targetId)
    peerConnectionRef.current = peerConnection

    setVideoCall(videoCall)
    setIsCalling(true)
    await startLocalStream(videoCall)

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    ws.send(
      JSON.stringify({
        type: 'call',
        targetId,
        offer,
        isVideoCall: videoCall,
      }),
    )
  }

  const rejectCall = () => {
    ws.send(
      JSON.stringify({
        type: 'reject-call',
        callerId: callerId,
      }),
    )

    setCallerId('')
    setCallerOffer(null)
  }

  const handleHangUp = useCallback(
    (manualFire: boolean) => {
      if (manualFire) {
        // Gửi tín hiệu "hang up" cho đối tác
        ws.send(
          JSON.stringify({
            type: 'hang-up',
            // get partner id from current call
            targetId: callerId || targetId,
          }),
        )
      }

      // Clean up local and remote streams
      _resetAll()
    },
    [_resetAll, callerId, targetId],
  )

  const createPeerConnection = (targetId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun.l.google.com:5349' },
        { urls: 'stun:stun1.l.google.com:3478' },
        { urls: 'stun:stun1.l.google.com:5349' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:5349' },
        { urls: 'stun:stun3.l.google.com:3478' },
        { urls: 'stun:stun3.l.google.com:5349' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:5349' },
      ],
    })

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({
            type: 'ice-candidate',
            recipientId: targetId,
            candidate: event.candidate,
          }),
        )
      }
    }

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    return peerConnection
  }

  const startLocalStream = async (video: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: video ?? false, audio: true })
    stream.getTracks().forEach((track) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addTrack(track, stream)
      }
    })
    setLocalStream(stream)
  }

  useEffect(() => {
    ws.onerror = (error) => {
      console.error('Error:', error)
    }

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data)

      switch (data.type) {
        case 'id':
          setClientId(data.id)
          break

        case 'offer':
          handleReceiveOffer(data.offer, data.from, data.isVideoCall)
          break

        case 'answer':
          handleReceiveAnswer(data.answer)
          break

        case 'ice-candidate':
          handleNewICECandidate(data.candidate)
          break

        case 'call-rejected':
          _resetAll()
          break

        case 'hang-up':
          handleHangUp(false)
          break

        default:
          Logger.log('Unknown message:', data)
      }
    }
  }, [_resetAll, handleHangUp])

  return (
    <CallSocketContext.Provider
      value={{
        selfId: clientId ?? '',
        isCalling,
        isInCall,
        makeCall,
        doRejectCall: rejectCall,
        callerId,
        doAnswer: handleDoAnswer,
        doHangUp: handleHangUp,
        localStream,
        remoteStream,
      }}>
      {children}
    </CallSocketContext.Provider>
  )
}
export { CallContextProvider, CallSocketContext }
