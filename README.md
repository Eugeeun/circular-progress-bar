# Circular Progress Bar

SVG 기반의 원형 프로그레스 바 라이브러리입니다. 다양한 스타일 프레임워크와 함께 사용할 수 있도록 설계되었습니다.

## 특징

- 🎨 **유연한 스타일링**: Tailwind CSS, styled-components, 일반 CSS 등과 호환
- 📱 **반응형 지원**: 컨테이너 크기에 자동으로 맞춤
- 🎯 **동적 색상**: 진행률에 따른 색상 변화 지원
- ⚡ **부드러운 애니메이션**: CSS 트랜지션 기반 애니메이션
- 🔧 **타입스크립트**: 완전한 타입 지원
- 🎪 **커스터마이징**: 모든 요소에 대한 세밀한 제어

## 설치

```bash
npm install circular-progress-bar
```

또는 CDN 사용:

```html
<script type="module">
  import { CircularProgressBar } from "https://unpkg.com/circular-progress-bar/dist/index.js";
</script>
```

## 기본 사용법

```javascript
import { CircularProgressBar } from "circular-progress-bar";

const container = document.getElementById("progress-container");
const progressBar = new CircularProgressBar(container, {
  value: 75,
  maxValue: 100,
  size: 200,
  gaugeColor: "#3b82f6",
  text: "75%",
});
```

## 스타일 프레임워크와 함께 사용

### 1. Tailwind CSS

#### 기본 사용법

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 50,
  maxValue: 100,
  size: 200,
  // Tailwind 클래스 적용
  className: "shadow-lg rounded-full",
  gaugeClassName: "stroke-blue-500 stroke-2",
  trailClassName: "stroke-gray-200 stroke-2",
  textClassName: "text-gray-800 text-xl font-bold",
  disableInlineStyles: true, // 인라인 스타일 비활성화
});
```

#### ⚠️ Tailwind CSS 사용 시 주의사항

Tailwind CSS를 사용할 때는 `disableInlineStyles: true`를 설정해야 하며, 일부 옵션들이 작동하지 않거나 대안이 필요합니다:

**작동하지 않는 옵션들:**

- `gaugeColor` (문자열) - Tailwind 클래스로 대체
- `trailColor` (문자열) - Tailwind 클래스로 대체
- `textColor` - Tailwind 클래스로 대체
- `textSize` - Tailwind 클래스로 대체
- `textFont` - Tailwind 클래스로 대체
- `gaugeWidth` - Tailwind 클래스로 대체
- `trailWidth` - Tailwind 클래스로 대체

**대안 방법:**

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 60,
  maxValue: 100,
  size: 200,
  // ❌ 작동하지 않음
  // gaugeColor: "#3b82f6",
  // textColor: "#1f2937",
  // textSize: 18,
  // gaugeWidth: 12,

  // ✅ Tailwind 클래스로 대체
  gaugeClassName: "stroke-blue-500 stroke-[12]", // 색상 + 두께
  trailClassName: "stroke-gray-200 stroke-[12]",
  textClassName: "fill-gray-800 text-lg font-semibold", // 색상 + 크기 + 폰트
  disableInlineStyles: true,
});
```

#### stroke-linecap 사용법

Tailwind CSS에서는 `stroke-linecap` 속성을 직접 지원하지 않으므로, 다음과 같은 방법들을 사용할 수 있습니다:

**방법 1: 커스텀 CSS 클래스 사용**

```css
/* styles.css */
.stroke-linecap-round {
  stroke-linecap: round;
}

.stroke-linecap-square {
  stroke-linecap: square;
}

.stroke-linecap-butt {
  stroke-linecap: butt;
}
```

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 60,
  maxValue: 100,
  size: 200,
  gaugeClassName: "stroke-blue-500 stroke-[12] stroke-linecap-round",
  trailClassName: "stroke-gray-200 stroke-[12] stroke-linecap-round",
  disableInlineStyles: true,
});
```

**방법 2: Tailwind 설정 확장**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      strokeLinecap: {
        round: "round",
        square: "square",
        butt: "butt",
      },
    },
  },
};
```

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 60,
  maxValue: 100,
  size: 200,
  gaugeClassName: "stroke-blue-500 stroke-[12] stroke-linecap-round",
  trailClassName: "stroke-gray-200 stroke-[12] stroke-linecap-round",
  disableInlineStyles: true,
});
```

**방법 3: 라이브러리 내장 옵션 사용**

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 60,
  maxValue: 100,
  size: 200,
  gaugeType: "round", // "round" 또는 "flat"
  gaugeClassName: "stroke-blue-500 stroke-[12]",
  trailClassName: "stroke-gray-200 stroke-[12]",
  disableInlineStyles: true,
});
```

#### 동적 색상과 Tailwind CSS

동적 색상을 사용하려면 `disableInlineStyles: false`로 설정해야 합니다:

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 30,
  maxValue: 100,
  size: 200,
  // 동적 색상은 인라인 스타일로 적용됨
  gaugeColor: progress => {
    if (progress < 0.3) return "#ef4444"; // red-500
    if (progress < 0.7) return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  },
  // Tailwind 클래스는 일부만 적용 가능
  gaugeClassName: "stroke-linecap-round", // stroke-linecap만 적용
  trailClassName: "stroke-linecap-round",
  textClassName: "fill-gray-800 font-semibold",
  disableInlineStyles: false, // 동적 색상을 위해 필요
});
```

### 2. Styled Components

```javascript
import styled from "styled-components";

const ProgressContainer = styled.div`
  .progress-gauge {
    stroke: ${props => props.theme.primaryColor};
    transition: stroke-dashoffset 0.8s ease-in-out;
  }

  .progress-trail {
    stroke: ${props => props.theme.backgroundColor};
    opacity: 0.2;
  }
`;

const progressBar = new CircularProgressBar(container, {
  value: 60,
  maxValue: 100,
  size: 200,
  gaugeClassName: "progress-gauge",
  trailClassName: "progress-trail",
  disableInlineStyles: true,
});
```

### 3. 일반 CSS

```css
/* styles.css */
.progress-gauge {
  stroke: #3b82f6;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease-in-out;
}

.progress-trail {
  stroke: #e5e7eb;
  stroke-width: 8;
  stroke-linecap: round;
  opacity: 0.2;
}

.progress-text {
  fill: #374151;
  font-size: 18px;
  font-weight: 600;
}
```

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 70,
  maxValue: 100,
  size: 200,
  gaugeClassName: "progress-gauge",
  trailClassName: "progress-trail",
  textClassName: "progress-text",
  disableInlineStyles: true,
});
```

## 동적 색상

진행률에 따라 색상이 자동으로 변화하는 기능을 지원합니다:

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 30,
  maxValue: 100,
  size: 200,
  // 진행률에 따른 동적 색상
  gaugeColor: progress => {
    if (progress < 0.3) return "#ef4444"; // 빨간색 (0-30%)
    if (progress < 0.7) return "#f59e0b"; // 주황색 (30-70%)
    return "#10b981"; // 초록색 (70-100%)
  },
  trailColor: progress => `rgba(0, 0, 0, ${0.1 + progress * 0.2})`,
  disableInlineStyles: false, // 동적 색상을 위해 인라인 스타일 유지
});
```

## API 참조

### 생성자 옵션

| 옵션                  | 타입                 | 기본값        | 설명                      | Tailwind CSS 사용 시    |
| --------------------- | -------------------- | ------------- | ------------------------- | ----------------------- |
| `value`               | `number`             | -             | 현재 값 (필수)            | ✅ 작동                 |
| `maxValue`            | `number`             | -             | 최대 값 (필수)            | ✅ 작동                 |
| `size`                | `number`             | 컨테이너 크기 | SVG 크기 (픽셀)           | ✅ 작동                 |
| `responsive`          | `boolean`            | `false`       | 반응형 모드               | ✅ 작동                 |
| `gaugeWidth`          | `number`             | `12`          | 게이지 선 두께            | ❌ Tailwind 클래스 사용 |
| `gaugeColor`          | `string \| function` | `"#2196f3"`   | 게이지 색상               | ❌ Tailwind 클래스 사용 |
| `gaugeType`           | `"round" \| "flat"`  | `"round"`     | 게이지 끝 모양            | ✅ 작동                 |
| `trailWidth`          | `number`             | `12`          | 배경 트레일 선 두께       | ❌ Tailwind 클래스 사용 |
| `trailColor`          | `string \| function` | `"#e0e0e0"`   | 배경 트레일 색상          | ❌ Tailwind 클래스 사용 |
| `textColor`           | `string`             | `"#333"`      | 텍스트 색상               | ❌ Tailwind 클래스 사용 |
| `text`                | `string`             | 퍼센트        | 표시할 텍스트             | ✅ 작동                 |
| `textSize`            | `number`             | `24`          | 텍스트 크기               | ❌ Tailwind 클래스 사용 |
| `textFont`            | `string`             | `"Arial"`     | 텍스트 폰트               | ❌ Tailwind 클래스 사용 |
| `animate`             | `boolean`            | `true`        | 애니메이션 활성화         | ✅ 작동                 |
| `duration`            | `number`             | `800`         | 애니메이션 지속 시간 (ms) | ✅ 작동                 |
| `className`           | `string`             | -             | SVG 요소 CSS 클래스       | ✅ 작동                 |
| `gaugeClassName`      | `string`             | -             | 게이지 원 CSS 클래스      | ✅ 작동                 |
| `trailClassName`      | `string`             | -             | 트레일 원 CSS 클래스      | ✅ 작동                 |
| `textClassName`       | `string`             | -             | 텍스트 CSS 클래스         | ✅ 작동                 |
| `disableInlineStyles` | `boolean`            | `false`       | 인라인 스타일 비활성화    | ✅ 작동 (필수)          |

### 메서드

| 메서드                                     | 설명                              |
| ------------------------------------------ | --------------------------------- |
| `setValue(value: number)`                  | 값을 설정합니다                   |
| `getValue(): number`                       | 현재 값을 반환합니다              |
| `setGaugeColor(color: string \| function)` | 게이지 색상을 설정합니다          |
| `setTrailColor(color: string \| function)` | 트레일 색상을 설정합니다          |
| `setClassName(className: string)`          | SVG CSS 클래스를 설정합니다       |
| `setGaugeClassName(className: string)`     | 게이지 CSS 클래스를 설정합니다    |
| `setTrailClassName(className: string)`     | 트레일 CSS 클래스를 설정합니다    |
| `setTextClassName(className: string)`      | 텍스트 CSS 클래스를 설정합니다    |
| `setDisableInlineStyles(disable: boolean)` | 인라인 스타일 활성화/비활성화     |
| `getClassNames()`                          | 현재 CSS 클래스 설정을 반환합니다 |
| `getSVGElement(): SVGElement`              | SVG 요소를 반환합니다             |
| `getGaugeElement(): SVGPathElement`        | 게이지 원 요소를 반환합니다       |
| `getTrailElement(): SVGPathElement`        | 트레일 원 요소를 반환합니다       |
| `getTextElement(): SVGTextElement`         | 텍스트 요소를 반환합니다          |
| `destroy()`                                | 인스턴스를 정리합니다             |

## 예시

### 기본 예시

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 0,
  maxValue: 100,
  size: 300,
  text: "",
  gaugeWidth: 24,
});

// 값 업데이트
setInterval(() => {
  progressBar.setValue(progressBar.getValue() + 10);
}, 1000);
```

### 반응형 예시

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 50,
  maxValue: 100,
  responsive: true, // 컨테이너 크기에 자동 맞춤
  gaugeWidth: 16,
  gaugeColor: "#10b981",
  text: "50%",
});
```

### 커스텀 스타일 예시

```javascript
const progressBar = new CircularProgressBar(container, {
  value: 80,
  maxValue: 100,
  size: 250,
  gaugeWidth: 20,
  gaugeColor: "#8b5cf6",
  trailColor: "#ede9fe",
  text: "80%",
  textSize: 28,
  textColor: "#5b21b6",
  gaugeType: "round",
  className: "drop-shadow-lg",
  gaugeClassName: "progress-gauge stroke-purple-500",
  trailClassName: "progress-trail stroke-purple-100",
  textClassName: "progress-text fill-purple-800 font-bold",
  disableInlineStyles: true,
});
```

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
