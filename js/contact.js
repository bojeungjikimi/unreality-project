// =========================================
// Contact Form - Step-by-step Logic
// =========================================

// EmailJS 초기화
(function(){
    emailjs.init({
        publicKey: "IlLEKruddDnX0TLdG",
    });
})();

// 폼 초기화
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    if (!form) return; // contact.html이 아닌 경우 종료
    
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const backBtn = document.getElementById('backBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    let current = 0;
    
    // 진행률 업데이트
    function updateProgress() {
        const progress = ((current + 1) / steps.length) * 100;
        progressFill.style.width = progress + '%';
    }

    // 스텝 표시 함수
    function showStep(index) {
        steps.forEach((s, i) => s.classList.toggle('active', i === index));
        backBtn.disabled = index === 0;
        submitBtn.style.display = index === steps.length - 1 ? 'block' : 'none';
        current = index;
        updateProgress();
        
        // 진행 단계 표시 업데이트
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, i) => {
            step.classList.remove('active', 'completed');
            if (i === index) {
                step.classList.add('active');
            } else if (i < index) {
                step.classList.add('completed');
            }
        });
        
        // 포커스 설정
        setTimeout(() => {
            const activeStep = steps[index];
            if (!activeStep) return;
            
            // 특정 스텝은 자동 포커스 생략
            if (index === 3 || index === 5 || index === 6) {
                return;
            }
            
            const focusTarget = activeStep.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])');
            if (focusTarget && typeof focusTarget.focus === 'function') {
                focusTarget.focus({ preventScroll: true });
                if (
                    focusTarget.tagName === 'INPUT' &&
                    ['text', 'tel', 'email', 'number', 'search', 'url'].includes(focusTarget.type)
                ) {
                    if (typeof focusTarget.select === 'function') {
                        focusTarget.select();
                    }
                }
            }
        }, 0);
    }

    // 유효성 검사 및 다음 단계
    function validateAndNext() {
        const active = steps[current];
        const input = active.querySelector('input, select, textarea');
        if (input && !input.checkValidity()) {
            input.reportValidity();
            return;
        }
        if (current < steps.length - 1) {
            current += 1;
            showStep(current);
        }
    }

    // Enter 키로 다음 단계
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateAndNext();
        }
    });

    // Select 변경 시 자동으로 다음 단계
    form.addEventListener('change', function(e) {
        const active = steps[current];
        if (active.contains(e.target)) {
            validateAndNext();
        }
    });

    // 이메일 입력 자동 진행
    form.addEventListener('input', function(e) {
        const active = steps[current];
        if (active.contains(e.target) && e.target.id === 'email') {
            const emailValue = e.target.value.trim();
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (emailValue && emailRegex.test(emailValue)) {
                setTimeout(() => {
                    if (e.target.checkValidity()) {
                        validateAndNext();
                    }
                }, 500);
            }
        }
    });

    // 전화번호 자동 포맷 및 자동 진행
    form.addEventListener('input', function(e) {
        const active = steps[current];
        if (active.contains(e.target) && e.target.id === 'phone') {
            const phoneValue = e.target.value.replace(/[^0-9]/g, '');
            
            if (phoneValue.length <= 3) {
                e.target.value = phoneValue;
            } else if (phoneValue.length <= 7) {
                e.target.value = phoneValue.slice(0, 3) + '-' + phoneValue.slice(3);
            } else if (phoneValue.length <= 11) {
                e.target.value = phoneValue.slice(0, 3) + '-' + phoneValue.slice(3, 7) + '-' + phoneValue.slice(7);
            }
            
            if (phoneValue.length === 11) {
                setTimeout(() => {
                    if (e.target.checkValidity()) {
                        validateAndNext();
                    }
                }, 300);
            }
        }
    });

    // 뒤로가기 버튼
    backBtn.addEventListener('click', function() {
        if (current > 0) {
            current -= 1;
            showStep(current);
        }
    });

    // 폼 제출
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const investmentType = document.getElementById('investmentType').value;
        
        // 필수 항목 검증
        if (!name || !phone || !email || !investmentType) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            current = 2;
            showStep(current);
            return;
        }
        
        // 폼 데이터 수집
        const formData = {
            name,
            phone,
            email,
            investmentType,
            budget: document.getElementById('budget').value,
            preferredDate: document.getElementById('preferredDate').value,
            preferredTime: document.getElementById('preferredTime').value,
            message: document.getElementById('message').value.trim(),
            displayDate: new Date().toLocaleString('ko-KR')
        };
        
        // 제출 버튼 비활성화
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';       
        
        try {
            // EmailJS 템플릿 파라미터
            const templateParams = {
                to_name: '부동산 상담팀',
                from_name: formData.name,
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email,
                investment_type: formData.investmentType,
                budget: formData.budget || '미선택',
                preferred_date: formData.preferredDate || '미선택',
                preferred_time: formData.preferredTime || '미선택',
                message: formData.message || '없음',
                submit_time: formData.displayDate
            };

            // EmailJS 전송
            await emailjs.send(
                'service_dkd58ql',
                'template_cutbw6g',
                templateParams
            );
            
            // 성공 메시지 및 폼 리셋
            alert('상담 신청이 완료되었습니다.\n24시간 내에 연락드리겠습니다.');
            form.reset();
            current = 0;
            showStep(current);
        } catch (error) {
            console.error('전송 중 오류:', error);
            alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            // 제출 버튼 활성화
            submitBtn.disabled = false;
            submitBtn.textContent = '상담 신청하기';
        }
    });

    // 초기 표시
    showStep(current);
    updateProgress();
    
    // 페이지 로드시 오늘 날짜를 최소값으로 설정
    const preferredDateInput = document.getElementById('preferredDate');
    if (preferredDateInput) {
        preferredDateInput.min = new Date().toISOString().split('T')[0];
    }
});

