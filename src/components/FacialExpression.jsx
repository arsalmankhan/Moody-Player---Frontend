import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';


export default function FacialExpression({ setSongs }) {
    const videoRef = useRef();


    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };


    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error('Error accessing webcam: ', err));
    };


    async function detectMood() {
        if (!videoRef.current) return;
        const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();


        if (!detections || detections.length === 0) {
            alert('Face not detected. Please look straight towards the camera. 🙂');
            return;
        }

        let best = { name: '', prob: 0 };
        const expressions = detections[0].expressions;
        for (const name of Object.keys(expressions)) {
            const p = expressions[name];
            if (p > best.prob) best = { name, prob: p };
        }


        try {
            const res = await axios.get(`https://moody-player-backend-cjox.onrender.com/songs?mood=${best.name}`);
            setSongs(res.data.songs || []);
        } catch (e) {
            console.error(e);
            alert('There’s an issue fetching songs. Please check the backend port/URL.');
        }
    }


    useEffect(() => {
        loadModels().then(startVideo);
        return () => {
            const s = videoRef.current?.srcObject;
            if (s && s.getTracks) s.getTracks().forEach(t => t.stop());
        };
    }, []);


    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover bg-black"
                />
                <div className="absolute inset-0 pointer-events-none ring-2 ring-white/10 rounded-xl"></div>
            </div>


            <button onClick={detectMood} className="btn mt-4">
                Detect Mood
            </button>


            <div className="mt-3 text-xs text-white/60">
                The camera is used locally and securely. Only the mood data is sent to the backend.
            </div>
        </div>
    );
}