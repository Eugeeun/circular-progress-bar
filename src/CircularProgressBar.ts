/**
 * 색상 타입 정의
 */
type ColorValue = string | ((progress: number) => string);

/**
 * 원형 프로그레스 바의 설정 옵션 인터페이스
 */
interface CircularProgressBarOptions {
  value: number; // 현재 값
  maxValue: number; // 최대 값
  size?: number; // SVG 크기 (픽셀, 기본값: 컨테이너의 최소 크기)
  responsive?: boolean; // 반응형 모드 (기본값: false)
  gaugeWidth?: number; // 게이지 선 두께 (기본값: 12)
  gaugeColor?: ColorValue; // 게이지 색상 (기본값: "#2196f3")
  gaugeType?: "round" | "flat"; // 게이지 끝 모양 (기본값: 'round')
  trailWidth?: number; // 배경 트레일 선 두께 (기본값: 12)
  trailColor?: ColorValue; // 배경 트레일 색상 (기본값: "#e0e0e0")
  textColor?: string; // 텍스트 색상 (기본값: "#333")
  text?: string; // 표시할 텍스트 (기본값: 퍼센트)
  textSize?: number; // 텍스트 크기 (기본값: 24)
  textFont?: string; // 텍스트 폰트 (기본값: "Arial")
  animate?: boolean; // 애니메이션 활성화 (기본값: true)
  duration?: number; // 애니메이션 지속 시간 (기본값: 800ms)
}

/**
 * 원형 프로그레스 바 클래스
 * SVG를 사용하여 원형 프로그레스 바를 생성하고 관리합니다.
 */
export class CircularProgressBar {
  private container: HTMLElement; // 프로그레스 바가 렌더링될 컨테이너
  private options: CircularProgressBarOptions; // 설정 옵션
  private svg!: SVGElement; // SVG 요소
  private gauge!: SVGPathElement; // 게이지 원 (진행률 표시)
  private trail!: SVGPathElement; // 트레일 원 (배경)
  private text!: SVGTextElement; // 텍스트 요소
  private resizeObserver?: ResizeObserver; // 컨테이너 크기 변화 감지용
  private currentSize: number = 0; // 현재 SVG 크기

  /**
   * CircularProgressBar 생성자
   * @param container - 프로그레스 바를 렌더링할 HTML 요소
   * @param options - 프로그레스 바 설정 옵션
   */
  constructor(container: HTMLElement, options: CircularProgressBarOptions) {
    this.container = container;
    // 기본값과 사용자 옵션을 병합
    this.options = {
      responsive: false,
      gaugeWidth: 12,
      gaugeColor: "#2196f3",
      gaugeType: "round",
      trailWidth: 12,
      trailColor: "#e0e0e0",
      textColor: "#333",
      textSize: 24,
      textFont: "Arial",
      animate: true,
      duration: 800,
      ...options,
    };

    // 반응형 모드일 때 size가 없으면 컨테이너 크기로 설정
    if (this.options.responsive && !this.options.size) {
      this.options.size = this.getContainerSize();
    }

    this.initialize();
    this.render();

    // 반응형 모드일 때 ResizeObserver 설정
    if (this.options.responsive) {
      this.setupResizeObserver();
    }
  }

  /**
   * 색상 값을 해석합니다.
   * 문자열이면 그대로 반환하고, 함수면 현재 진행률을 기반으로 색상을 계산합니다.
   * @param colorValue - 색상 값 (문자열 또는 함수)
   * @param progress - 현재 진행률 (0~1)
   * @returns 해석된 색상 문자열
   */
  private resolveColor(colorValue: ColorValue, progress: number): string {
    if (typeof colorValue === "function") {
      return colorValue(progress);
    }
    return colorValue;
  }

  /**
   * SVG 요소와 원형 프로그레스 바를 초기화합니다.
   * 바깥쪽 라인이 일치하도록 반지름을 조정합니다.
   */
  private initialize() {
    // 초기 크기 설정
    if (!this.options.size) {
      this.options.size = this.getContainerSize();
    }
    this.currentSize = this.options.size;

    // SVG 요소 생성
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", this.options.size.toString());
    this.svg.setAttribute("height", this.options.size.toString());
    this.svg.setAttribute("viewBox", `0 0 ${this.options.size} ${this.options.size}`);
    this.svg.style.transform = "rotate(-90deg)"; // 상단에서 시작하도록 -90도 회전

    // 기본 반지름과 중심점 계산
    const maxStrokeWidth = Math.max(this.options.gaugeWidth!, this.options.trailWidth!);
    const baseRadius = (this.options.size - maxStrokeWidth) / 2;
    const centerX = this.options.size / 2;
    const centerY = this.options.size / 2;

    // 각 원의 반지름을 계산하여 바깥쪽 라인이 일치하도록 조정
    // 더 얇은 선을 가진 원의 반지름을 늘려서 바깥쪽 라인을 맞춤
    const trailRadius = baseRadius + (maxStrokeWidth - this.options.trailWidth!) / 2;
    const gaugeRadius = baseRadius + (maxStrokeWidth - this.options.gaugeWidth!) / 2;

    // 트레일 원 생성 (배경)
    this.trail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.trail.setAttribute("cx", centerX.toString());
    this.trail.setAttribute("cy", centerY.toString());
    this.trail.setAttribute("r", trailRadius.toString());
    this.trail.setAttribute("fill", "none");
    this.trail.setAttribute("stroke", this.resolveColor(this.options.trailColor!, 0)); // 초기 진행률 0으로 색상 해석
    this.trail.setAttribute("stroke-width", this.options.trailWidth!.toString());

    // 게이지 원 생성 (진행률 표시)
    this.gauge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.gauge.setAttribute("cx", centerX.toString());
    this.gauge.setAttribute("cy", centerY.toString());
    this.gauge.setAttribute("r", gaugeRadius.toString());
    this.gauge.setAttribute("fill", "none");
    this.gauge.setAttribute("stroke", this.resolveColor(this.options.gaugeColor!, 0)); // 초기 진행률 0으로 색상 해석
    this.gauge.setAttribute("stroke-width", this.options.gaugeWidth!.toString());
    this.gauge.setAttribute(
      "stroke-linecap",
      this.options.gaugeType === "round" ? "round" : "butt"
    ); // 게이지 타입에 따라 선 끝 모양 설정

    // stroke-dasharray를 원의 둘레로 고정하고 stroke-dashoffset으로 애니메이션 제어
    const circumference = 2 * Math.PI * gaugeRadius;
    this.gauge.style.strokeDasharray = circumference.toString();
    this.gauge.style.strokeDashoffset = circumference.toString(); // 초기값: 진행률 0%

    // 텍스트 컨테이너 그룹 생성
    const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    textGroup.setAttribute(
      "transform",
      `translate(${this.options.size / 2}, ${this.options.size / 2}) rotate(90)`
    );

    // 텍스트 요소 생성
    this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.text.setAttribute("fill", this.options.textColor!);
    this.text.setAttribute("font-size", this.options.textSize!.toString());
    this.text.setAttribute("font-family", this.options.textFont!);
    this.text.setAttribute("text-anchor", "middle"); // 텍스트 중앙 정렬
    this.text.setAttribute("dominant-baseline", "middle"); // 세로 중앙 정렬
    this.text.setAttribute("x", "0");
    this.text.setAttribute("y", "0");

    // 텍스트를 그룹에 추가
    textGroup.appendChild(this.text);

    // SVG에 요소들을 추가
    this.svg.appendChild(this.trail);
    this.svg.appendChild(this.gauge);
    this.svg.appendChild(textGroup);

    // 컨테이너를 비우고 SVG 추가
    this.container.innerHTML = "";
    this.container.appendChild(this.svg);
  }

  /**
   * 현재 값에 따라 프로그레스 바를 렌더링합니다.
   * stroke-dashoffset을 조정하여 진행률을 표시합니다.
   */
  private render() {
    // initialize 메서드와 동일한 반지름 계산 로직 사용
    const maxStrokeWidth = Math.max(this.options.gaugeWidth!, this.options.trailWidth!);
    const baseRadius = (this.currentSize - maxStrokeWidth) / 2;
    const gaugeRadius = baseRadius + (maxStrokeWidth - this.options.gaugeWidth!) / 2;
    const circumference = 2 * Math.PI * gaugeRadius; // 원의 둘레

    // 진행률 계산 (0~1 사이 값으로 정규화)
    const progress = Math.min(Math.max(this.options.value / this.options.maxValue, 0), 1);
    const dashLength = circumference * progress; // 표시할 선의 길이

    // 색상 동적 업데이트 (함수인 경우에만)
    if (typeof this.options.gaugeColor === "function") {
      this.gauge.setAttribute("stroke", this.resolveColor(this.options.gaugeColor, progress));
    }
    if (typeof this.options.trailColor === "function") {
      this.trail.setAttribute("stroke", this.resolveColor(this.options.trailColor, progress));
    }

    // 게이지 업데이트 - stroke-dashoffset으로 애니메이션 제어
    this.gauge.style.strokeDasharray = circumference.toString();
    this.gauge.style.strokeDashoffset = (circumference - dashLength).toString();

    // 애니메이션 설정 (animate 옵션이 true이고 duration이 0보다 클 때만)
    if (this.options.animate && this.options.duration! > 0) {
      this.gauge.style.transition = `stroke-dashoffset ${this.options.duration}ms ease-in-out`;
    } else {
      this.gauge.style.transition = "none"; // 애니메이션 비활성화
    }

    // 텍스트 내용 설정
    const displayText = this.options.text ?? `${Math.round(progress * 100)}%`;
    this.text.textContent = displayText;
  }

  /**
   * 프로그레스 바의 값을 설정합니다.
   * @param value - 새로운 값 (0 ~ maxValue 사이)
   */
  public setValue(value: number) {
    this.options.value = Math.min(Math.max(value, 0), this.options.maxValue);
    this.render();
  }

  /**
   * 현재 값을 반환합니다.
   * @returns 현재 값
   */
  public getValue(): number {
    return this.options.value;
  }

  /**
   * 컨테이너의 크기를 가져옵니다.
   * @returns 컨테이너의 최소 크기 (가로, 세로 중 작은 값)
   */
  private getContainerSize(): number {
    const rect = this.container.getBoundingClientRect();
    return Math.min(rect.width, rect.height);
  }

  /**
   * ResizeObserver를 설정하여 컨테이너 크기 변화를 감지합니다.
   */
  private setupResizeObserver() {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const newSize = Math.min(entry.contentRect.width, entry.contentRect.height);
          if (newSize !== this.currentSize && newSize > 0) {
            this.resize(newSize);
          }
        }
      });
      this.resizeObserver.observe(this.container);
    }
  }

  /**
   * SVG 크기를 조정합니다.
   * @param newSize - 새로운 크기
   */
  private resize(newSize: number) {
    this.currentSize = newSize;
    this.options.size = newSize;

    // SVG 크기 업데이트
    this.svg.setAttribute("width", newSize.toString());
    this.svg.setAttribute("height", newSize.toString());
    this.svg.setAttribute("viewBox", `0 0 ${newSize} ${newSize}`);

    // 원들의 위치와 크기 재계산
    const maxStrokeWidth = Math.max(this.options.gaugeWidth!, this.options.trailWidth!);
    const baseRadius = (newSize - maxStrokeWidth) / 2;
    const centerX = newSize / 2;
    const centerY = newSize / 2;

    const trailRadius = baseRadius + (maxStrokeWidth - this.options.trailWidth!) / 2;
    const gaugeRadius = baseRadius + (maxStrokeWidth - this.options.gaugeWidth!) / 2;

    // 트레일 원 업데이트
    this.trail.setAttribute("cx", centerX.toString());
    this.trail.setAttribute("cy", centerY.toString());
    this.trail.setAttribute("r", trailRadius.toString());

    // 게이지 원 업데이트
    this.gauge.setAttribute("cx", centerX.toString());
    this.gauge.setAttribute("cy", centerY.toString());
    this.gauge.setAttribute("r", gaugeRadius.toString());

    // stroke-dasharray와 stroke-dashoffset 재계산
    const circumference = 2 * Math.PI * gaugeRadius;
    const progress = Math.min(Math.max(this.options.value / this.options.maxValue, 0), 1);
    const dashLength = circumference * progress;

    this.gauge.style.strokeDasharray = circumference.toString();
    this.gauge.style.strokeDashoffset = (circumference - dashLength).toString();

    // 리사이즈 시에는 애니메이션을 일시적으로 비활성화하여 부드러운 크기 조정
    this.gauge.style.transition = "none";

    // 텍스트 그룹 위치 업데이트
    const textGroup = this.svg.querySelector("g");
    if (textGroup) {
      textGroup.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(90)`);
    }

    // 리사이즈 완료 후 애니메이션 설정 복원
    setTimeout(() => {
      if (this.options.animate && this.options.duration! > 0) {
        this.gauge.style.transition = `stroke-dashoffset ${this.options.duration}ms ease-in-out`;
      }
    }, 0);
  }

  /**
   * 인스턴스를 정리합니다.
   * ResizeObserver를 해제합니다.
   */
  public destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  /**
   * 게이지 색상을 동적으로 업데이트합니다.
   * @param color - 새로운 색상 (문자열 또는 함수)
   */
  public setGaugeColor(color: ColorValue) {
    this.options.gaugeColor = color;
    const progress = Math.min(Math.max(this.options.value / this.options.maxValue, 0), 1);
    this.gauge.setAttribute("stroke", this.resolveColor(color, progress));
  }

  /**
   * 트레일 색상을 동적으로 업데이트합니다.
   * @param color - 새로운 색상 (문자열 또는 함수)
   */
  public setTrailColor(color: ColorValue) {
    this.options.trailColor = color;
    const progress = Math.min(Math.max(this.options.value / this.options.maxValue, 0), 1);
    this.trail.setAttribute("stroke", this.resolveColor(color, progress));
  }

  /**
   * 현재 게이지 색상을 반환합니다.
   * @returns 현재 게이지 색상 설정
   */
  public getGaugeColor(): ColorValue {
    return this.options.gaugeColor!;
  }

  /**
   * 현재 트레일 색상을 반환합니다.
   * @returns 현재 트레일 색상 설정
   */
  public getTrailColor(): ColorValue {
    return this.options.trailColor!;
  }
}
