// =========================================
// Main JavaScript - 앤 리얼티 웹사이트
// =========================================

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    // 컴포넌트 로딩
    loadComponents();
    
    // 헤더 스크롤 효과 초기화 (index.html만 해당)
    initHeaderScroll();
    
    // CTA 버튼 위치 초기화 (index.html만 해당)
    initCTAPosition();
    
    // 숫자 카운트업 애니메이션 (about.html만 해당)
    initNumberAnimation();
});

// ===== 컴포넌트 동적 로딩 =====
function loadComponents() {
    // Navbar 로딩
    fetch('_navbar.html')
        .then(response => response.text())
        .then(html => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = html;
                
                // 현재 페이지에 active 클래스 추가
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const pageKey = currentPage.replace('.html', '');
                const activeLink = document.querySelector(`[data-page="${pageKey}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                
                // 네비게이션 토글 기능 초기화
                initNavToggle();
            }
        })
        .catch(error => console.error('Navbar 로딩 실패:', error));
    
    // Footer 로딩
    fetch('_footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(error => console.error('Footer 로딩 실패:', error));
}

// ===== 네비게이션 토글 기능 =====
function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// ===== 헤더 스크롤 효과 (index.html) =====
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return; // header가 없으면 종료
    
    // 헤더 스크롤 효과 설정
    header.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.style.opacity = '0.8';
        } else {
            header.style.opacity = '1';
        }
    }
    
    // 초기 실행 및 이벤트 리스너 등록
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
}

// ===== CTA 버튼 위치 제어 (index.html) =====
function initCTAPosition() {
    const cta = document.getElementById('cta');
    const footer = document.getElementById('footer-section');
    
    if (!cta || !footer) return; // 요소가 없으면 종료
    
    // CTA 초기 설정
    cta.style.position = 'fixed';
    cta.style.bottom = '0';
    cta.style.left = '0';
    cta.style.right = '0';
    cta.style.zIndex = '1000';
    cta.style.width = '100%';
    cta.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    cta.style.opacity = '1';
    cta.style.visibility = 'visible';
    cta.style.pointerEvents = 'auto';
    
    function updateCTAPosition() {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 푸터가 화면에 나타나면 CTA를 완전히 숨김
        if (footerRect.top < windowHeight) {
            cta.style.opacity = '0';
            cta.style.visibility = 'hidden';
            cta.style.pointerEvents = 'none';
        } else {
            cta.style.bottom = '0px';
            cta.style.opacity = '1';
            cta.style.visibility = 'visible';
            cta.style.pointerEvents = 'auto';
        }
    }
    
    // 초기 실행 및 이벤트 리스너 등록
    updateCTAPosition();
    window.addEventListener('scroll', updateCTAPosition, { passive: true });
    window.addEventListener('resize', updateCTAPosition);
}

// ===== 숫자 카운트업 애니메이션 (about.html) =====
function initNumberAnimation() {
    const stats = document.querySelectorAll('.expert-stats .stat-number, .stat-number-embedded');
    if (!stats || stats.length === 0) return; // 요소가 없으면 종료
    
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (isNaN(finalValue)) return;
        
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 50);
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue + (stat.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                stat.textContent = currentValue + (stat.textContent.includes('+') ? '+' : '');
            }
        }, 30);
    });
}
