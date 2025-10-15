// =========================================
// Services Page - 탭 전환 기능
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabBtns || tabBtns.length === 0) return; // services.html이 아닌 경우 종료
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // 클릭한 탭 버튼에 active 클래스 추가
            this.classList.add('active');
            
            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // 선택된 탭 콘텐츠 표시 (부드러운 전환 효과)
            const targetContent = document.getElementById('tab-' + targetTab);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 100);
            }
        });
    });
});

