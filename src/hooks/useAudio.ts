import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔥 最稳的初始化方式
  useEffect(() => {
    const audio = new Audio();
    audio.src = '/bgm.mp3';  // 明确写
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // 🔥 强制播放
  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(err => console.log('播放失败（浏览器限制）', err));
    }
  }, []);

  // 暂停
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // 开关
  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return {
    isPlaying,
    toggleAudio,
    setAudioEnabled: toggleAudio,
  };
}