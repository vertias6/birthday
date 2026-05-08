import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FinalSceneProps {
  isSoundEnabled: boolean
}

function FinalScene({ isSoundEnabled }: FinalSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const subTextRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // 主文字淡入并放大
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' }
    )

    // 副标题淡入
    tl.fromTo(subTextRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    ), '-=0.4'

    // 添加漂浮动画
    tl.to(textRef.current, {
      y: -10,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, '-=0.2')

    // 微光效果
    tl.to(lightRef.current, {
      opacity: 0.3,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, '-=0.2')
  }, [isSoundEnabled])

  return (
    <div className="final-scene" ref={containerRef}>
      <div className="light-effect" ref={lightRef}></div>
      
      <div className="final-content">
        {/* 👇 关键修改：给文字容器加了滚动和内边距 */}
        <div 
          ref={textRef} 
          className="final-letter"
          style={{
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '0 16px 40px',
            boxSizing: 'border-box'
          }}
        >
          <p>hi 大傻子</p>
          <p>让我来看看今天的寿星是谁呢</p>
          <p>原来是大傻子，时间过得好快已经为大傻子过了3次生日呢</p>
          <p>不知道还记不记得我前2次说了些什么呢</p>
          <p>我过生时看到大傻子给我的是网页祝福还蛮惊讶的</p>
          <p>其实我在这之前我就想过等你过生日的时候我一定要发挥专业所长弄一个好看的网页祝福出来</p>
          <p>不过看来被抢先了，那我就得搞个更好的吧</p>
          <p>咳咳好吧技术水平有限不过就现在这样我也是花费了相当大的精力了，所以不许说难看</p>
          <p>关于情感嘛，其实很多时候我都不知道该怎么做</p>
          <p>找不到人诉说也没人引导，遇到问题我想的会很天真会主动将原因归咎于自己身上</p>
          <p>时间长了对我来说其实是蛮内耗的，对了感谢你在大学期间能主动找到我，让我有了一次追悔的机会</p>
          <p>最后祝大傻子新的一岁开心快乐!</p>
          <p>愿你人生除了自由</p>
          <p>还有无怨无悔的万千时光</p>
        </div>
        <p ref={subTextRef} className="final-subtext">
          2026.05.08
        </p>
      </div>
    </div>
  )
}

export default FinalScene