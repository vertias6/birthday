import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // 初始化音频
  useEffect(() => {
    const audio = new Audio('/bgm.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // 监听用户第一次点击（浏览器必须要交互才能播放声音）
    const handleFirstInteraction = () => {
      setUserInteracted(true);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // 播放
  const play = useCallback(() => {
    if (!audioRef.current || !userInteracted) return;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => console.log('播放失败', err));
  }, [userInteracted]);

  // 暂停
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // 开关
  const toggleAudio = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  return {
    isPlaying,
    toggleAudio,
    setAudioEnabled: toggleAudio, // 兼容你现有组件
  };
}