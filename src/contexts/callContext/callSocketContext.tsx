import { createContext, ReactNode, useEffect, useRef, useState } from 'react'

interface CallSocketContextType {
  selfId?: string
  isCalling?: boolean
  isInCall?: boolean
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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  // useEffect(() => {
  //   ws.onopen = () => {
  //     console.log('Connected to the signaling server')
  //   }
  //   startLocalStream()
  // }, [])

  // useEffect(() => {
  //   if (isInCall || isCalling) {
  //     startLocalStream()
  //   }
  // }, [isInCall, isCalling])

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
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Clean up local and remote streams
    if (localStream) {
      const tracks = localStream.getTracks()
      tracks.forEach((track) => track.stop())
    }

    if (remoteStream) {
      const tracks = remoteStream.getTracks()
      tracks.forEach((track) => track.stop())
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
      setRemoteStream(event.streams[0])
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
    }

    return peerConnection
  }

  const startLocalStream = async () => {
    console.log('Requesting local stream')
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

    setLocalStream(stream)
  }

  return (
    <CallSocketContext.Provider
      value={{
        selfId: clientId ?? '',
        isCalling,
        isInCall,
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
