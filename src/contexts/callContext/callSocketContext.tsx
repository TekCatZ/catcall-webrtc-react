import { createContext, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'

interface CallSocketContextType {
  selfId?: string
  isCalling?: boolean
  isInCall?: boolean
  localStreamRef: MutableRefObject<HTMLVideoElement | null>
  remoteStreamRef: MutableRefObject<HTMLVideoElement | null>
  makeCall: (targetId: string) => void
  callerId?: string
  doAnswer?: () => void
  doHangUp?: (fireManually: boolean) => void
  localStream?: MediaStream | null
  remoteStream?: MediaStream | null
}

const CallSocketContext = createContext<CallSocketContextType | null>(null)
const ws = new WebSocket('ws://localhost:9090')

const CallContextProvider = ({ children }: { children: ReactNode }) => {
  const [clientId, setClientId] = useState<string | null>(null)

  const [isInCall, setIsInCall] = useState(false)
  // make call flow
  const [isCalling, setIsCalling] = useState(false)
  const [targetId, setTargetId] = useState('')

  // receive call flow
  const [callerId, setCallerId] = useState('')
  const [callerOffer, setCallerOffer] = useState<RTCSessionDescriptionInit | null>(null)

  const localStreamRef = useRef<HTMLVideoElement>(null)
  const remoteStreamRef = useRef<HTMLVideoElement>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    ws.onopen = () => {
      console.log('Connected to the signaling server')
    }
    startLocalStream()
  }, [])

  useEffect(() => {
    console.log('isInCall:', isInCall)
    if (isInCall || isCalling) {
      startLocalStream()
    }
  }, [isInCall, isCalling])

  useEffect(() => {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data)

      switch (data.type) {
        case 'id':
          setClientId(data.id)
          break

        case 'offer':
          handleReceiveOffer(data.offer, data.from)
          break

        case 'answer':
          handleReceiveAnswer(data.answer)
          break

        case 'ice-candidate':
          handleNewICECandidate(data.candidate)
          break

        case 'hang-up':
          handleHangUp(false)
          break

        default:
          console.log('Unknown message:', data)
      }
    }
  }, [])

  const handleNewICECandidate = (candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit, from: string) => {
    if (peerConnectionRef.current) return

    setCallerId(from)
    setCallerOffer(offer)
  }

  const handleDoAnswer = async () => {
    const peerConnection = createPeerConnection(callerId)
    peerConnectionRef.current = peerConnection

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

  const makeCall = async (targetId: string) => {
    setTargetId(targetId)
    const peerConnection = createPeerConnection(targetId)
    peerConnectionRef.current = peerConnection

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    ws.send(
      JSON.stringify({
        type: 'call',
        targetId,
        offer,
      }),
    )

    setIsCalling(true)
  }

  const handleHangUp = (manualFire: boolean) => {
    // Dừng stream và đóng kết nối WebRTC
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Dọn dẹp video stream
    if (localStreamRef.current && localStreamRef.current.srcObject) {
      const tracks = (localStreamRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      localStreamRef.current.srcObject = null
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = null
    }

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

    // Reset state
    setLocalStream(null)
    setRemoteStream(null)

    setCallerId('')
    setCallerOffer(null)
    setIsCalling(false)
    setIsInCall(false)
    setTargetId('')
  }

  const createPeerConnection = (targetId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
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
      console.log('Got remote stream', event)
      console.log('remoteStreamRef:', remoteStreamRef)
      console.log('remoteStreamRef.current:', remoteStreamRef.current)
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = event.streams[0]
      } else {
        setRemoteStream(event.streams[0])
      }
    }

    if (localStreamRef.current && localStreamRef.current.srcObject) {
      const localStreamCurrnt = localStreamRef?.current?.srcObject as MediaStream
      localStreamCurrnt.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamCurrnt)
      })
    } else {
      console.error('Local stream ref is not ready. Saving to state')
      localStream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
    }

    return peerConnection
  }

  const startLocalStream = async () => {
    let facingMode = 'user'
    if (facingMode == 'user') {
      facingMode = 'environment'
    } else {
      facingMode = 'user'
    }
    const constraints = {
      audio: false,
      video: {
        facingMode: facingMode,
      },
    }
    console.log('Requesting local stream')
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    console.log('Local stream:', stream)
    if (localStreamRef.current) {
      localStreamRef.current.srcObject = stream
    } else {
      console.log('Local stream ref is not ready, saving to state')
      setLocalStream(stream)
    }
  }

  return (
    <CallSocketContext.Provider
      value={{
        selfId: clientId ?? '',
        isCalling,
        isInCall,
        localStreamRef,
        remoteStreamRef,
        makeCall,
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
