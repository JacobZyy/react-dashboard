# React-Rainbow-Dashboard

写这个组件的想法起源于2023年末的一个大需求中的一张设计图

![dashboard-result](./doc/assets/dashboard-result.png)

看到这个设计图的第一眼。我脑袋里蹦出的想法就是一层层叠上去。最下层是一个conic渐变的色板，色板上方覆盖一个浅色的蒙版，蒙版上方再覆盖用于显示数组的数字盘。然后根据百分比用某种方法去遮挡底层的渐变色板，最终实现这个设计图

但是仔细一通分析之后，发现并不能这么层叠，因为色环是覆盖在浅色蒙版上方的。这就意味着我必须想一个方法去切这样的一个圆环出来。

于是就想到了用css属性的clipPath去切割div实现这个效果。在这个过程中还有一段为了定制大小而使用贝塞尔函数拟合圆弧的经历。后续会陆续做博文分享。

这个表盘属于是我第一次做开源的组件。有很多不足之处，如果你有更好的想法，或者有什么bug存在，欢迎提出issue或者pull request。

## Installation

`npm install -i react-rainbow-dashboard`

## PropsType

```tsx
export interface DashBoardProps {
  /** the percent of this dashboard */
  percent: number
  /** dashboard title */
  title?: string
  /** dashboard data className for customized its style */
  dashBoardDataCls?: string
  /**
   *  @description the size of dashboard
   *  @default 188px
   */
  dashBoardSize?: number
  /**
   *  the bg of your container of dashboard
   *  for fill the color in the small ring to make it feel like bg-transparent
   */
  bgColor?: string
  /** gradient color */
  conicGradientColor?: string
}
```

## Usage

### Basic Usage

```tsx
export default function () {
  const [percent, setPercent] = useState<number>(30)
  return <DashBoard percent={percent} />
}
```

<img src="./doc/assets/default-usage.png" style="zoom:50%;" />

### Advantage Usage

#### 也许你想要改变dashboar的大小

```tsx
export default function () {
  const [percent, setPercent] = useState<number>(30)
  return <DashBoard percent={percent} dashBoardSize={300}/>
}
```

<img src="./doc/assets/bigger-size.png" style="zoom:50%;" />

#### 也许你想换个颜色

```tsx
  const newBg = 'conic-gradient(from 90deg at 50% 50%, #69C7BC 0deg, #69C7BC 44.93379235267639deg, #38A1DD 77.43765950202942deg, #B052D1 142.20000386238098deg, #F12F75 182.07465648651123deg, #FF00B8 315.5447030067444deg)'

  export default function () {
  const [percent, setPercent] = useState<number>(30)
  return <DashBoard percent={percent} dashBoardSize={300} conicGradientColor={newBg}/>
}
```

<img src="./doc/assets/other-color.png" alt="other-color" style="zoom:50%;" />

#### 数据样式自定义

同样的，你也可以通过传递`dashBoardDataCls`这个类名来实现内部表盘数据的自定义

```tsx
  export default function () {
  const [percent, setPercent] = useState<number>(30)
  return <DashBoard percent={percent} dashBoardSize={300} conicGradientColor={newBg} dashBoardDataCls={"myClassName"}/>
}
```

react-rainbow-dashboar是基于unocss搭建的样式，权重低，可以随意覆盖。
