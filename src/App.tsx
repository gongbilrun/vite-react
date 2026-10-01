import React, { useState } from 'react';
import './App.css';

// 음료 정보 인터페이스
interface Beverage {
  id: string;
  name: string;
  price: number;
}

// 사이즈 옵션 인터페이스
interface SizeOption {
  id: string;
  name: string;
  extraPrice: number;
}

// 추가 옵션 인터페이스
interface ExtraOption {
  id: string;
  name: string;
  extraPrice: number;
}

// 1. 음료 목록 데이터
const BEVERAGES: Beverage[] = [
  { id: 'americano', name: '아메리카노', price: 3500 },
  { id: 'caffe_latte', name: '카페라떼', price: 4000 },
  { id: 'caffe_mocha', name: '카페모카', price: 4500 },
  { id: 'vanilla_latte', name: '바닐라라떼', price: 4500 },
  { id: 'green_tea_latte', name: '녹차라떼', price: 4500 },
];

// 2. 사이즈 옵션 데이터 (S: +0원, M: +500원, L: +1,000원)
const SIZES: SizeOption[] = [
  { id: 'S', name: 'S', extraPrice: 0 },
  { id: 'M', name: 'M', extraPrice: 500 },
  { id: 'L', name: 'L', extraPrice: 1000 },
];

// 3. 추가 옵션 데이터
const EXTRA_OPTIONS: ExtraOption[] = [
  { id: 'shot', name: '샷 추가', extraPrice: 500 },
  { id: 'cream', name: '크림 추가', extraPrice: 500 },
  { id: 'syrup', name: '시럽 추가', extraPrice: 300 },
  { id: 'decaf', name: '디카페인', extraPrice: 0 },
];

function App() {
  // 상태(State) 관리
  const [name, setName] = useState<string>(''); // 주문자 이름
  const [phone, setPhone] = useState<string>(''); // 전화번호
  const [selectedBeverage, setSelectedBeverage] = useState<string>(''); // 선택된 음료 ID
  const [selectedSize, setSelectedSize] = useState<string>('M'); // 사이즈 (기본값: M)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // 선택된 추가 옵션 ID 배열
  const [quantity, setQuantity] = useState<number>(1); // 수량 (기본값: 1)
  const [requests, setRequests] = useState<string>(''); // 요청사항
  const [orderConfirmation, setOrderConfirmation] = useState<string>(''); // 주문 확인 메시지

  // 추가 옵션 체크박스 변경 핸들러
  const handleOptionChange = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId) // 이미 체크되어 있다면 제거
        : [...prev, optionId] // 새로 체크되었다면 추가
    );
  };

  // 실시간 예상 금액 계산 함수
  const calculateTotal = (): number => {
    // 음료를 선택하지 않은 경우 0원
    if (!selectedBeverage) return 0;

    // 선택된 음료의 기본 가격
    const beverage = BEVERAGES.find((b) => b.id === selectedBeverage);
    const basePrice = beverage ? beverage.price : 0;

    // 선택된 사이즈 추가 금액
    const size = SIZES.find((s) => s.id === selectedSize);
    const sizePrice = size ? size.extraPrice : 0;

    // 선택된 추가 옵션 금액 합산
    const optionsPrice = selectedOptions.reduce((sum, optId) => {
      const opt = EXTRA_OPTIONS.find((o) => o.id === optId);
      return sum + (opt ? opt.extraPrice : 0);
    }, 0);

    // (기본가 + 사이즈금액 + 옵션금액) * 수량
    return (basePrice + sizePrice + optionsPrice) * quantity;
  };

  // 예상 금액 변수 (실시간 계산)
  const totalPrice = calculateTotal();

  // 주문하기 버튼 클릭 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 이름 입력 검증
    if (!name.trim()) {
      alert('이름을 입력해주세요');
      return;
    }

    // 음료 선택 검증
    if (!selectedBeverage) {
      alert('음료를 선택해주세요');
      return;
    }

    // 선택한 음료 이름 찾기
    const beverage = BEVERAGES.find((b) => b.id === selectedBeverage);
    const beverageName = beverage ? beverage.name : '';

    // 선택한 추가 옵션명 목록 생성
    const optionNames = selectedOptions
      .map((id) => EXTRA_OPTIONS.find((opt) => opt.id === id)?.name)
      .filter(Boolean);

    // 옵션 텍스트 형식 (예: " (샷 추가, 크림 추가)" 또는 추가옵션 없을 시 빈 문자열)
    const optionText = optionNames.length > 0 ? ` (${optionNames.join(', ')})` : '';

    // 주문 확인 메시지 생성
    // 형식: "홍길동님, 카페라떼 M사이즈 (샷 추가) 1잔, 총 5,000원 주문이 접수되었습니다!"
    const confirmMsg = `${name.trim()}님, ${beverageName} ${selectedSize}사이즈${optionText} ${quantity}잔, 총 ${totalPrice.toLocaleString()}원 주문이 접수되었습니다!`;

    setOrderConfirmation(confirmMsg);
  };

  // 다시 작성 버튼 클릭 처리 (모든 입력 및 상태 초기화)
  const handleReset = () => {
    setName('');
    setPhone('');
    setSelectedBeverage('');
    setSelectedSize('M');
    setSelectedOptions([]);
    setQuantity(1);
    setRequests('');
    setOrderConfirmation('');
  };

  return (
    <div className="cafe-app">
      {/* 1. 페이지 상단: 카페 로고 및 이름 */}
      <header className="cafe-header">
        <div className="cafe-logo" role="img" aria-label="커피 아이콘">☕</div>
        <h1 className="cafe-title">바이브 카페</h1>
        <p className="cafe-subtitle">당신의 하루에 바이브를 더하다</p>
      </header>

      <hr className="divider" />

      {/* 2. 주문서 작성 폼 */}
      <form onSubmit={handleSubmit} noValidate>
        {/* 항목 1: 이름 (필수) */}
        <div className="form-group">
          <label htmlFor="customer-name" className="form-label">
            이름 <span className="required-mark">*</span>
          </label>
          <input
            id="customer-name"
            type="text"
            className="form-input"
            placeholder="주문자 성함을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 항목 2: 전화번호 */}
        <div className="form-group">
          <label htmlFor="customer-phone" className="form-label">
            전화번호
          </label>
          <input
            id="customer-phone"
            type="tel"
            className="form-input"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* 항목 3: 음료 선택 (드롭다운) */}
        <div className="form-group">
          <label htmlFor="beverage-select" className="form-label">
            음료 선택 <span className="required-mark">*</span>
          </label>
          <select
            id="beverage-select"
            className="form-select"
            value={selectedBeverage}
            onChange={(e) => setSelectedBeverage(e.target.value)}
          >
            <option value="">-- 음료를 선택해주세요 --</option>
            {BEVERAGES.map((beverage) => (
              <option key={beverage.id} value={beverage.id}>
                {beverage.name} ({beverage.price.toLocaleString()}원)
              </option>
            ))}
          </select>
        </div>

        {/* 항목 4: 사이즈 선택 (라디오 버튼, 가로 배치) */}
        <div className="form-group">
          <label className="form-label">사이즈</label>
          <div className="choice-group">
            {SIZES.map((size) => (
              <label key={size.id} htmlFor={`size-${size.id}`} className="choice-label">
                <input
                  id={`size-${size.id}`}
                  type="radio"
                  name="size"
                  className="choice-input"
                  value={size.id}
                  checked={selectedSize === size.id}
                  onChange={(e) => setSelectedSize(e.target.value)}
                />
                {size.name} {size.extraPrice > 0 ? `(+${size.extraPrice.toLocaleString()}원)` : '(+0원)'}
              </label>
            ))}
          </div>
        </div>

        {/* 항목 5: 추가 옵션 (체크박스, 가로 배치) */}
        <div className="form-group">
          <label className="form-label">추가 옵션</label>
          <div className="choice-group">
            {EXTRA_OPTIONS.map((option) => (
              <label key={option.id} htmlFor={`option-${option.id}`} className="choice-label">
                <input
                  id={`option-${option.id}`}
                  type="checkbox"
                  className="choice-input"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                />
                {option.name} (+{option.extraPrice.toLocaleString()}원)
              </label>
            ))}
          </div>
        </div>

        {/* 항목 6: 수량 (number 타입, 최소 1, 최대 10, 기본값 1) */}
        <div className="form-group">
          <label htmlFor="order-quantity" className="form-label">
            수량
          </label>
          <input
            id="order-quantity"
            type="number"
            min="1"
            max="10"
            className="form-input"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              // 1~10 범위 내로 제한
              if (!isNaN(val)) {
                setQuantity(Math.min(10, Math.max(1, val)));
              }
            }}
          />
        </div>

        {/* 항목 7: 요청사항 (textarea) */}
        <div className="form-group">
          <label htmlFor="order-requests" className="form-label">
            요청사항
          </label>
          <textarea
            id="order-requests"
            className="form-textarea"
            placeholder="요청사항이 있으시면 적어주세요 (예: 덜 달게 해주세요)"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
          />
        </div>

        {/* 예상 금액 표시 영역 (주문하기 버튼 바로 위에 큰 글씨로 표시) */}
        <div className="price-box">
          <div className="price-title">예상 금액</div>
          <div className="price-amount">
            {totalPrice.toLocaleString()}원
          </div>
        </div>

        {/* 항목 8, 9: 버튼 그룹 (주문하기 & 다시 작성) */}
        <div className="button-group">
          <button type="submit" className="btn-submit">
            주문하기
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            다시 작성
          </button>
        </div>
      </form>

      {/* 주문 확인 메시지 표시 영역 */}
      {orderConfirmation && (
        <div className="order-confirmation" role="alert">
          <span className="confirmation-icon">✨</span>
          <span className="confirmation-text">{orderConfirmation}</span>
        </div>
      )}
    </div>
  );
}

export default App;
