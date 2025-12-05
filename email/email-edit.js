document.addEventListener('DOMContentLoaded', function () {
    console.log('Edit Campaign page loaded');

    // ===========================================
    // 0. CONFIG & TEMPLATES (Backend Placeholder)
    // ===========================================

    // В будущем эти переменные можно заполнять ответом от сервера (fetch)
    const EMAIL_TEMPLATES = {
        header: `
            <div class="header-logo">
                <a href="#" title="Submissions Portal">
                    <svg width="179" height="48" viewBox="0 0 179 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="7.60515" height="22.4481" fill="#159C2A" />
                        <rect width="23.6605" height="7.48269" fill="#159C2A" />
                        <rect x="25.3457" width="10.1402" height="36.582" fill="#159C2A" />
                        <rect y="24.1094" width="23.6605" height="12.4711" fill="#232323" />
                        <path d="M51.7885 20.9726V17.9524H47.1211V10.1274C47.1211 9.12069 47.1211 8.06821 47.5329 7.38181C48.0363 6.55813 48.9057 6.37508 49.6378 6.37508C50.3242 6.37508 51.1021 6.51237 51.7885 6.78693V3.58372C51.4224 3.44644 50.6445 3.17188 49.4548 3.17188C47.9448 3.17188 46.572 3.62948 45.6568 4.4074C43.9637 5.82596 43.8265 8.02245 43.8265 9.76133V17.9524H41.9961V20.9726H43.8265L43.8265 36.9429H47.1211L47.1211 20.9726H51.7885Z" fill="#232323" />
                        <path d="M56.1921 17.9524H52.8974V29.3924C52.8974 31.7262 53.1262 33.4651 54.6363 35.1124C56.3294 36.8971 58.5715 37.492 60.4477 37.492C62.3238 37.492 64.566 36.8971 66.259 35.1124C67.7691 33.4651 67.9979 31.7262 67.9979 29.3924V17.9524H64.7032V29.0264C64.7032 30.3534 64.7032 31.9092 63.7881 33.099C63.2847 33.7396 62.278 34.5633 60.4477 34.5633C58.6173 34.5633 57.6106 33.7396 57.1073 33.099C56.1921 31.9092 56.1921 30.3534 56.1921 29.0264V17.9524Z" fill="#232323" />
                        <path d="M69.637 36.9429H72.9316V27.0129C72.9316 25.6401 73.0231 23.3979 74.3044 21.8878C75.2653 20.7438 76.5008 20.4234 77.6448 20.4234C79.1091 20.4234 80.1158 20.9726 80.7564 21.7963C81.5343 22.803 81.6258 24.13 81.6258 25.274V36.9429H84.9205V25.1825C84.9205 23.0775 84.7832 21.5217 83.8222 20.1031C82.6783 18.41 80.6191 17.4948 78.3769 17.4948C75.2196 17.4948 73.5265 19.371 72.9316 20.1489V17.9524H69.637V36.9429Z" fill="#232323" />
                        <path d="M102.479 20.6522C101.61 19.5082 99.6423 17.4948 95.9816 17.4948C91.1311 17.4948 86.7383 20.881 86.7383 27.4247C86.7383 34.1057 91.1769 37.492 95.9816 37.492C99.322 37.492 101.381 35.7073 102.479 34.2888V36.9429H105.774V3.58372L102.479 3.58372V20.6522ZM96.3477 20.4234C99.2762 20.4234 102.662 22.5742 102.662 27.4705C102.662 31.2228 100.374 34.5633 96.3477 34.5633C92.4124 34.5633 90.1245 31.4974 90.1245 27.4247C90.1245 22.803 93.0988 20.4234 96.3477 20.4234Z" fill="#232323" />
                        <path d="M118.878 20.9268C117.368 17.6778 114.668 17.4948 113.661 17.4948C110.458 17.4948 108.125 19.4625 108.125 22.803C108.125 23.7639 108.262 24.6791 108.994 25.5943C109.863 26.6468 111.328 27.379 113.616 28.3857C115.4 29.1636 116.681 29.7585 116.681 31.5432C116.681 32.9617 115.72 34.5633 113.57 34.5633C111.19 34.5633 110.092 32.4584 109.726 31.4516L106.889 32.6414C108.491 37.4005 112.746 37.492 113.524 37.492C117.185 37.492 120.068 35.2497 120.068 31.2686C120.068 30.2161 119.885 29.2094 119.061 28.2027C118.329 27.2875 117.048 26.418 114.302 25.274C112.151 24.3588 111.236 23.947 111.236 22.5742C111.236 21.1098 112.334 20.4234 113.524 20.4234C114.76 20.4234 115.72 21.2471 116.178 22.3454L118.878 20.9268Z" fill="#232323" />
                        <path d="M121.237 36.9429H124.532V27.0129C124.532 25.6401 124.623 23.3979 125.905 21.8878C126.866 20.7438 128.101 20.4234 129.245 20.4234C130.709 20.4234 131.716 20.9726 132.357 21.7963C133.135 22.803 133.226 24.13 133.226 25.274V36.9429L136.521 36.9429V25.1825C136.521 23.0775 136.383 21.5217 135.423 20.1031C134.279 18.41 132.219 17.4948 129.977 17.4948C126.82 17.4948 125.127 19.371 124.532 20.1489V3.58372H121.237V36.9429Z" fill="#232323" />
                        <path d="M147.948 37.492C153.714 37.492 158.015 33.282 158.015 27.5163C158.015 21.7505 153.759 17.4948 147.948 17.4948C142.137 17.4948 137.881 21.7505 137.881 27.5163C137.881 33.282 142.182 37.492 147.948 37.492ZM147.948 20.4234C151.426 20.4234 154.629 22.8487 154.629 27.5163C154.629 32.138 151.38 34.5633 147.948 34.5633C144.562 34.5633 141.267 32.1838 141.267 27.5163C141.267 22.8945 144.47 20.4234 147.948 20.4234Z" fill="#232323" />
                        <path d="M162.701 34.2888C164.12 36.1192 166.271 37.492 169.336 37.492C175.102 37.492 178.442 32.7787 178.442 27.562C178.442 22.4369 175.148 17.4948 169.199 17.4948C167.826 17.4948 164.943 17.8151 162.701 20.6065V17.9524H159.407V47.6507H162.701V34.2888ZM168.879 34.5633C164.989 34.5633 162.518 31.4059 162.518 27.5163C162.518 22.9403 165.767 20.4234 168.833 20.4234C171.899 20.4234 175.056 22.8945 175.056 27.562C175.056 31.3601 172.723 34.5633 168.879 34.5633Z" fill="#232323" />
                    </svg>
                    </a>
            </div>
            <div class="header-socials">
                <a href="#" class="social-icon fb">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V21.1474H21.8132V0H0ZM14.4305 5.8198H12.7255C12.3878 5.8198 12.047 6.15816 12.047 6.40989V8.09536H14.4271C14.3313 9.38776 14.1345 10.5696 14.1345 10.5696H12.0348V17.8939H8.90587V10.5688H7.38273V8.10414H8.90587V6.08905C8.90587 5.72057 8.82888 3.25349 12.1118 3.25349H14.4305V5.8198H14.4305Z" fill="#159C2A" />
                    </svg>
                </a>
                <a href="#" class="social-icon ig">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6473 4.84766H7.16568C5.97165 4.84766 5 5.78959 5 6.94723V14.2004C5 15.3583 5.97165 16.3002 7.16568 16.3002H14.6473C15.8415 16.3002 16.8132 15.3583 16.8132 14.2004V6.94723C16.8132 5.78964 15.8415 4.84766 14.6473 4.84766ZM10.9063 14.344C8.76224 14.344 7.0176 12.6526 7.0176 10.5737C7.0176 8.49506 8.76224 6.80367 10.9063 6.80367C13.0507 6.80367 14.7953 8.49506 14.7953 10.5737C14.7953 12.6526 13.0507 14.344 10.9063 14.344ZM14.9204 7.58328C14.4128 7.58328 14 7.18311 14 6.69125C14 6.19935 14.4128 5.79917 14.9204 5.79917C15.4278 5.79917 15.8406 6.19935 15.8406 6.69125C15.8406 7.18316 15.4278 7.58328 14.9204 7.58328Z" fill="#159C2A" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9059 8.39844C9.66812 8.39844 8.66016 9.37517 8.66016 10.5752C8.66016 11.7756 9.66812 12.7526 10.9059 12.7526C12.1442 12.7526 13.1514 11.7756 13.1514 10.5752C13.1514 9.37517 12.1442 8.39844 10.9059 8.39844Z" fill="#159C2A" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V21.1474H21.8132V0H0ZM18.4564 14.2003C18.4564 16.2368 16.748 17.893 14.6474 17.893H7.16581C5.06545 17.893 3.35683 16.2368 3.35683 14.2003V6.94709C3.35683 4.91084 5.06545 3.25437 7.16581 3.25437H14.6474C16.748 3.25437 18.4564 4.91084 18.4564 6.94709V14.2003Z" fill="#159C2A" />
                    </svg>
                </a>
                <a href="#" class="social-icon in">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8138 9.49527V9.46484C11.8074 9.47505 11.7985 9.48525 11.793 9.49527H11.8138Z" fill="#159C2A" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V21.1474H21.8132V0H0ZM6.78472 17.5687H3.54841V8.12924H6.78472V17.5687ZM5.16656 6.84087H5.14518C4.05955 6.84087 3.35588 6.11577 3.35588 5.20946C3.35588 4.28325 4.08012 3.57869 5.18775 3.57869C6.29562 3.57869 6.97643 4.28325 6.99762 5.20946C6.99762 6.11577 6.29562 6.84087 5.16656 6.84087ZM18.4573 17.5687H15.2201V12.5185C15.2201 11.2501 14.7524 10.3843 13.5808 10.3843C12.686 10.3843 12.1543 10.9673 11.9201 11.532C11.8349 11.7337 11.8127 12.0141 11.8127 12.2969V17.5687H8.57489C8.57489 17.5687 8.61827 9.01482 8.57489 8.12928H11.8127V9.46687C12.2429 8.82515 13.0105 7.90768 14.7302 7.90768C16.8605 7.90768 18.4573 9.25646 18.4573 12.1557V17.5687Z" fill="#159C2A" />
                    </svg>
                </a>
            </div>
        `,
        footer: `
            <div class="footer-divider">POWERED BY</div>
            <div class="footer-content">
                <div class="footer-profile">
                    <img src="../assets/images/email-footer.png" alt="Manager" class="manager-photo">
                    <div class="manager-info">
                        <h3>Val Baltsevych</h3>
                        <p>Finance Manager</p>
                    </div>
                </div>
                <div class="footer-details">
                    <div class="fd-col fd-contacts">
                        <div class="fd-contact">
                            <svg width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.146767 0.564197L1.10245 0.0360811C1.17102 -0.00177445 1.24394 -0.00984189 1.31935 0.011878C1.39475 0.0339085 1.45184 0.0795217 1.48939 0.148411L2.23533 1.51493C2.29552 1.62539 2.27815 1.75665 2.19127 1.84757L1.59519 2.47064C1.51048 2.55938 1.49155 2.68567 1.54679 2.7952C1.84963 3.39438 2.45251 4.10802 2.99274 4.50679C3.09142 4.57971 3.21926 4.58219 3.32072 4.5133L4.0344 4.02987C4.13866 3.95943 4.27084 3.96409 4.36952 4.04197L5.59242 5.00576C5.65417 5.05447 5.68986 5.11808 5.69885 5.19627C5.70785 5.27416 5.68768 5.34459 5.63896 5.40603L4.95849 6.26027C4.89178 6.34405 4.79186 6.38159 4.68667 6.36298C2.42524 5.96177 0.018037 3.11266 5.29117e-06 0.815877C-0.000615255 0.708203 0.0533658 0.61602 0.146767 0.564197Z" fill="#232323" /></svg>
                            <p><span class="w500">Phone:</span> (239) 265-9663</p>
                        </div>
                        <div class="fd-contact">
                            <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.62673 0.398202L4.40987 2.2995L6.62673 4.2008V0.398202ZM6.51522 4.50121C6.45112 4.56152 6.36503 4.59869 6.27059 4.59869L0.35619 4.59907C0.26251 4.59907 0.176411 4.56228 0.112697 4.50197L2.44976 2.49746L2.80324 2.80088C2.94508 2.92263 3.13093 2.98255 3.31601 2.98179C3.50072 2.98104 3.68694 2.91921 3.82956 2.79671L4.1781 2.49747L6.51522 4.50121ZM0 4.20235L2.2188 2.29949L0 0.396639V4.20235ZM0.11226 0.0967147C0.176358 0.036789 0.262077 0 0.356132 0H6.27053C6.36497 0 6.45107 0.0371686 6.51479 0.0978516L4.08364 2.18315L4.08099 2.18542L4.08023 2.18618L3.63496 2.56811C3.54773 2.64283 3.43206 2.68076 3.31561 2.68114C3.19955 2.6819 3.08501 2.64549 2.9993 2.57229L2.54872 2.18618L2.54796 2.18542L2.54531 2.18315L0.11226 0.0967147Z" fill="#232323" /></svg>
                            <p><span class="w500">Email:</span> amelia@gofundshop.com</p>
                        </div>
                        <div class="fd-contact">
                            <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.170018 2.27027C0.170018 1.01663 1.18656 0 2.44029 0C3.69402 0 4.71057 1.0163 4.71057 2.27027C4.71057 3.43766 3.53533 4.85792 2.66695 5.69838C2.54083 5.82071 2.33979 5.82071 2.21366 5.69838C1.34537 4.85784 0.170018 3.43758 0.170018 2.27027ZM3.69297 5.04186C3.41765 5.37187 3.13346 5.66996 2.8784 5.91679C2.63406 6.15292 2.2462 6.15292 2.00185 5.91679C1.74676 5.66992 1.4629 5.37183 1.18729 5.04186C0.476057 5.18505 0 5.44616 0 5.74456C0 6.1969 1.09245 6.56325 2.43997 6.56325C3.78749 6.56325 4.87994 6.19657 4.87994 5.74456C4.88025 5.44616 4.4042 5.18505 3.69297 5.04186ZM2.44029 1.45506C1.98985 1.45506 1.62476 1.82016 1.62476 2.2706C1.62476 2.72104 1.98985 3.08613 2.44029 3.08613C2.89073 3.08613 3.25583 2.72104 3.25583 2.2706C3.25583 1.81984 2.89073 1.45506 2.44029 1.45506Z" fill="#232323" /></svg>
                            <p><span class="w500">Address:</span> 3434 Hancock Bridge Pkwy, North Fort Myers, FL 33903</p>
                        </div>
                    </div>

                    <div class="fd-col fd-actions">
                        <div class="fd-socials">
                            <a href="#"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4932 14.084H0V0H14.4932V14.084ZM5.51074 9.59375C5.70919 10.4219 6.00492 11.2226 6.39062 11.9775C6.57239 12.0097 6.75643 12.0315 6.94043 12.043V9.60254C6.62087 9.60116 6.09397 9.59789 5.51074 9.59375ZM7.55273 9.60254V12.043C7.73688 12.0319 7.92161 12.0098 8.10352 11.9775C8.48867 11.2225 8.78303 10.4219 8.98145 9.59375C8.39837 9.59789 7.87218 9.6007 7.55273 9.60254ZM2.8584 9.59375C3.47069 10.641 4.40802 11.4344 5.51172 11.8389C5.35425 11.4796 5.21368 11.1121 5.09277 10.7373C4.9732 10.3695 4.87144 9.99573 4.78711 9.61621H4.6875C3.7995 9.6087 3.22891 9.60079 2.8584 9.59375ZM9.80566 9.61719H9.70508C9.62075 9.99599 9.51951 10.3693 9.40039 10.7373C9.27946 11.112 9.13896 11.4797 8.98145 11.8389C10.0851 11.4341 11.0229 10.6413 11.6357 9.59375C11.2649 9.6022 10.6937 9.60921 9.80566 9.61719ZM7.24707 4.89844C7.02391 4.898 2.41401 4.92094 2.2168 4.9541H2.21484C1.8608 5.01823 1.54761 5.33545 1.48535 5.69141V5.69336C1.44766 5.92009 1.42871 6.67517 1.42871 6.94043C1.42873 7.2061 1.44712 7.96063 1.48438 8.18652V8.18848C1.54727 8.54512 1.86098 8.86156 2.21484 8.9248H2.2168C2.41404 8.95841 7.02426 8.98145 7.24707 8.98145C7.4752 8.98142 12.0787 8.95795 12.2764 8.9248H12.2783C12.6323 8.86113 12.946 8.5444 13.0078 8.18848V8.18652C13.0455 7.96013 13.0644 7.20607 13.0645 6.94043C13.0645 6.67508 13.0461 5.91936 13.0088 5.69336V5.69141C12.9469 5.3351 12.6323 5.0183 12.2783 4.95508H12.2764C12.0774 4.92148 7.47074 4.89844 7.24707 4.89844ZM2.84277 6.09473C2.92089 6.07401 3.0048 6.08479 3.0752 6.125C3.14493 6.16483 3.19483 6.23085 3.21387 6.30762L3.38574 6.92773L3.64355 6.32129C3.70306 6.18207 3.84316 6.09092 3.99805 6.09082C4.15348 6.09082 4.29353 6.18199 4.35352 6.32129L4.61426 6.93066L4.78613 6.30859C4.80749 6.23386 4.85819 6.16933 4.92773 6.13086C4.99719 6.09293 5.07956 6.08281 5.15625 6.10352C5.31658 6.14682 5.41053 6.30831 5.36621 6.46387V6.46289L5.05664 7.51953L5.03418 7.57715C4.97112 7.70549 4.8374 7.79017 4.6875 7.79102H4.66797C4.51345 7.79146 4.37348 7.70091 4.31348 7.5625L3.99707 6.83496L3.68555 7.56152C3.62603 7.70057 3.48631 7.79127 3.33203 7.79102H3.30957C3.13829 7.79006 2.98814 7.67902 2.94043 7.51855L2.63379 6.46191C2.61017 6.38632 2.61914 6.30477 2.6582 6.23535C2.69774 6.16637 2.76415 6.11551 2.84277 6.09473ZM5.75195 6.09473C5.83058 6.07394 5.91438 6.08476 5.98438 6.125C6.05432 6.1648 6.1045 6.23071 6.12402 6.30762L6.2959 6.92773L6.55469 6.32129C6.6142 6.18204 6.75381 6.09089 6.90918 6.09082C7.06416 6.09082 7.20414 6.182 7.26367 6.32129L7.52441 6.93066L7.69629 6.30859C7.71763 6.23392 7.76844 6.16934 7.83789 6.13086C7.90743 6.09283 7.99058 6.08273 8.06738 6.10352C8.22746 6.14694 8.32154 6.30846 8.27734 6.46387V6.46289L7.96777 7.51953L7.94531 7.57715C7.88232 7.70558 7.74818 7.79014 7.59863 7.79102H7.57812C7.42369 7.79137 7.2836 7.70128 7.22363 7.5625L6.9082 6.83496L6.59668 7.56152C6.53715 7.70081 6.39671 7.79144 6.24219 7.79102H6.2207C6.0494 7.79013 5.89835 7.67954 5.85059 7.51953L5.54297 6.46191C5.51985 6.38635 5.52887 6.30472 5.56836 6.23535C5.6074 6.16645 5.67391 6.11556 5.75195 6.09473ZM8.66016 6.09473C8.7383 6.07398 8.82216 6.08478 8.89258 6.125C8.96235 6.16482 9.01318 6.23083 9.03223 6.30762L9.20312 6.92773L9.46094 6.32129C9.52089 6.18209 9.66012 6.09095 9.81543 6.09082C9.97041 6.09082 10.1104 6.18199 10.1699 6.32129L10.4307 6.93066L10.6035 6.30859C10.6244 6.23386 10.676 6.16933 10.7451 6.13086C10.8145 6.09308 10.8966 6.08286 10.9736 6.10352C11.1335 6.14681 11.2278 6.30834 11.1836 6.46387L10.874 7.51953C10.8263 7.67958 10.6762 7.79009 10.5049 7.79102H10.4844C10.33 7.7913 10.1908 7.70078 10.1309 7.5625L9.81445 6.83496L9.50293 7.56152C9.44383 7.70079 9.30341 7.79146 9.14844 7.79102H9.12695L9.06348 7.78516C8.91925 7.76107 8.79919 7.65932 8.75781 7.51953L8.45117 6.46191C8.42756 6.38634 8.43654 6.30475 8.47559 6.23535C8.51513 6.16637 8.58153 6.11551 8.66016 6.09473ZM11.6631 7.09277C11.7893 7.14413 11.8711 7.26402 11.8711 7.39746C11.8714 7.55639 11.7557 7.68905 11.6016 7.71973L11.5332 7.72656C11.396 7.72653 11.2724 7.64634 11.2197 7.52344C11.1675 7.40008 11.1971 7.25825 11.2939 7.16406C11.3908 7.07 11.5364 7.04195 11.6631 7.09277ZM6.94043 1.83691C6.75658 1.8484 6.5727 1.87068 6.39062 1.90234C6.00492 2.65781 5.70919 3.45898 5.51074 4.28711C6.094 4.28297 6.6209 4.2797 6.94043 4.27832V1.83691ZM5.51172 2.04102C4.40815 2.44582 3.47024 3.23891 2.85742 4.28613C3.22827 4.27909 3.79939 4.2731 4.6875 4.26465H4.78711C4.87146 3.88566 4.97361 3.51175 5.09277 3.14355C5.21412 2.76895 5.35425 2.4006 5.51172 2.04102ZM7.55273 4.27832C7.87266 4.2797 8.39885 4.28199 8.98145 4.28613C8.783 3.4582 8.48816 2.65762 8.10254 1.90234C7.92072 1.87062 7.73679 1.84841 7.55273 1.83691V4.27832ZM8.98145 2.04102C9.13898 2.40037 9.279 2.7687 9.40039 3.14355C9.51952 3.5113 9.62074 3.88517 9.70508 4.26465H9.80566C10.6941 4.27263 11.2653 4.27909 11.6357 4.28613C11.023 3.23822 10.0851 2.44541 8.98145 2.04102Z" fill="#159C2A" /></svg></a>
                            <a href="#"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V14.0845H14.5279V0H0ZM9.61091 3.87608H8.47537C8.25046 3.87608 8.02347 4.10143 8.02347 4.26908V5.39163H9.60867C9.54485 6.2524 9.41381 7.03952 9.41381 7.03952H8.01536V11.9176H5.93145V7.03899H4.91702V5.39748H5.93145V4.0554C5.93145 3.80999 5.88017 2.16687 8.06664 2.16687H9.61094V3.87608H9.61091Z" fill="#159C2A" /></svg></a>
                            <a href="#"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.75533 3.22656H4.77245C3.97721 3.22656 3.33008 3.8539 3.33008 4.62491V9.45566C3.33008 10.2268 3.97721 10.8542 4.77245 10.8542H9.75533C10.5507 10.8542 11.1978 10.2268 11.1978 9.45566V4.62491C11.1978 3.85394 10.5507 3.22656 9.75533 3.22656ZM7.26379 9.55127C5.83579 9.55127 4.67383 8.42478 4.67383 7.04021C4.67383 5.65579 5.83579 4.5293 7.26379 4.5293C8.69196 4.5293 9.85392 5.65579 9.85392 7.04021C9.85392 8.42478 8.69196 9.55127 7.26379 9.55127ZM9.93725 5.04853C9.59916 5.04853 9.32424 4.78201 9.32424 4.45443C9.32424 4.12681 9.59916 3.86029 9.93725 3.86029C10.2751 3.86029 10.5501 4.12681 10.5501 4.45443C10.5501 4.78205 10.2751 5.04853 9.93725 5.04853Z" fill="#159C2A" /><path fill-rule="evenodd" clip-rule="evenodd" d="M7.26328 5.59375C6.4389 5.59375 5.76758 6.24427 5.76758 7.04348C5.76758 7.84301 6.4389 8.49368 7.26328 8.49368C8.08798 8.49368 8.75881 7.84301 8.75881 7.04348C8.75881 6.24427 8.08798 5.59375 7.26328 5.59375Z" fill="#159C2A" /><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V14.0845H14.5279V0H0ZM12.2922 9.45761C12.2922 10.8139 11.1544 11.917 9.75542 11.917H4.77254C3.37367 11.917 2.2357 10.8139 2.2357 9.45761V4.62687C2.2357 3.2707 3.37367 2.16746 4.77254 2.16746H9.75542C11.1544 2.16746 12.2922 3.2707 12.2922 4.62687V9.45761Z" fill="#159C2A" /></svg></a>
                            <a href="#"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.86762 6.32525V6.30469C7.86328 6.31158 7.85728 6.31848 7.85352 6.32525H7.86762Z" fill="#159C2A" /><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V14.0845H14.5279V0H0ZM4.51873 11.701H2.36329V5.4142H4.51873V11.701ZM3.44101 4.55613H3.42677C2.70373 4.55613 2.23507 4.0732 2.23507 3.46958C2.23507 2.85271 2.71742 2.38347 3.45512 2.38347C4.19298 2.38347 4.64641 2.85271 4.66053 3.46958C4.66053 4.0732 4.19298 4.55613 3.44101 4.55613ZM12.2929 11.701H10.1369V8.33755C10.1369 7.49276 9.82535 6.9161 9.04502 6.9161C8.44909 6.9161 8.09496 7.30437 7.93895 7.68047C7.88225 7.81481 7.86743 8.00157 7.86743 8.18996V11.701H5.71101C5.71101 11.701 5.7399 6.00401 5.71101 5.41423H7.86743V6.30508C8.15393 5.87769 8.66522 5.26664 9.81053 5.26664C11.2294 5.26664 12.2929 6.16495 12.2929 8.09585V11.701Z" fill="#159C2A" /></svg></a>
                        </div>
                        <a href="#" class="fd-apply-btn" style="text-decoration: none; display: inline-block;">Apply now</a>
                    </div>

                    <div class="fd-col fd-disclaimer">
                        <p>The contents of this email message and any attachments are intended solely for the addressee(s) and may contain privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message or their agent, or if this message has been addressed to you in error, please immediately alert the sender and then delete this message and any attachments. Any use, dissemination, copying, or storage of this message is strictly prohibited.</p>
                    </div>
                </div>
            </div>
            <div class="footer-copyright">© Copyright Fundshop, 2019-2025</div>
        `
    };

    // --- 0.1 CENTRALIZED FONT LIST ---
    const FONT_OPTIONS = [
        { label: 'Match email settings', value: 'inherit', group: 'Default' },

        { label: 'Arial', value: 'Arial, Helvetica, sans-serif', group: 'Sans Serif' },
        { label: 'Arial Black', value: "'Arial Black', Gadget, sans-serif", group: 'Sans Serif' },
        { label: 'Helvetica', value: 'Helvetica, sans-serif', group: 'Sans Serif' },
        { label: 'Verdana', value: 'Verdana, Geneva, sans-serif', group: 'Sans Serif' },
        { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif', group: 'Sans Serif' },
        { label: 'Trebuchet MS', value: "'Trebuchet MS', Helvetica, sans-serif", group: 'Sans Serif' },
        { label: 'Impact', value: 'Impact, Charcoal, sans-serif', group: 'Sans Serif' },
        { label: 'Lucida Sans', value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", group: 'Sans Serif' },

        { label: 'Times New Roman', value: "'Times New Roman', Times, serif", group: 'Serif' },
        { label: 'Georgia', value: 'Georgia, serif', group: 'Serif' },
        { label: 'Palatino', value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", group: 'Serif' },

        { label: 'Courier New', value: "'Courier New', Courier, monospace", group: 'Monospace' },
        { label: 'Lucida Console', value: "'Lucida Console', Monaco, monospace", group: 'Monospace' }
    ];

    // ===========================================
    // 0.2 RENDER STATIC LAYOUT
    // ===========================================

    function renderStaticLayout() {
        // Находим контейнеры в DOM
        const headerContainer = document.getElementById('static-header-container');
        const footerContainer = document.getElementById('static-footer-container');

        // Вставляем HTML из переменных
        if (headerContainer) {
            headerContainer.innerHTML = EMAIL_TEMPLATES.header;
        }
        if (footerContainer) {
            footerContainer.innerHTML = EMAIL_TEMPLATES.footer;
        }
    }

    // Вызываем функцию рендера сразу при загрузке
    renderStaticLayout();


    // ===========================================
    // 0. GLOBAL VARIABLES
    // ===========================================
    let blocksData = [];
    let selectedBlockId = null;
    let dragSrcIndex = null;
    let isPreviewMode = false;

    // History State
    const historyStack = [];
    let historyStep = -1;
    const MAX_HISTORY = 50;

    // DOM Elements
    const dropzone = document.getElementById('dynamic-builder-area');
    const paperElement = document.querySelector('.email-paper');
    const canvasContainer = document.querySelector('.canvas-container');

    // Create Code Editor Area (PRE tag) inside Canvas dynamically
    const codeEditor = document.createElement('pre');
    codeEditor.id = 'canvas-code-editor';
    canvasContainer.appendChild(codeEditor);


    // ===========================================
    // 1. HELPER FUNCTIONS
    // ===========================================

    // --- Helper: Fill a <select> with options from FONT_OPTIONS ---
    function populateFontSelect(selectElement, includeInherit = true) {
        selectElement.innerHTML = '';

        // Group options
        const groups = {};
        FONT_OPTIONS.forEach(opt => {
            if (!includeInherit && opt.value === 'inherit') return;
            if (!groups[opt.group]) groups[opt.group] = [];
            groups[opt.group].push(opt);
        });

        // Create HTML options
        for (const [groupName, options] of Object.entries(groups)) {
            if (groupName === 'Default') {
                options.forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt.value;
                    el.textContent = opt.label;
                    selectElement.appendChild(el);
                });
            } else {
                const optgroup = document.createElement('optgroup');
                optgroup.label = groupName;
                options.forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt.value;
                    el.textContent = opt.label;
                    optgroup.appendChild(el);
                });
                selectElement.appendChild(optgroup);
            }
        }
    }

    // --- Helper: Convert Native Select to Custom UI ---
    function initCustomSelect(selectElement) {
        if (!selectElement || selectElement.style.display === 'none') return;

        // Hide native select
        selectElement.style.display = 'none';

        // Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-font-select';

        // Header (Selected Value)
        const header = document.createElement('div');
        header.className = 'font-select-header';
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const currentText = selectedOption ? selectedOption.text : 'Select Font';

        header.innerHTML = `
            <span class="current-font">${currentText}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // List Container
        const list = document.createElement('div');
        list.className = 'font-options-list';

        // Generate Items
        Array.from(selectElement.options).forEach(opt => {
            const item = document.createElement('div');
            item.className = 'font-option-item';
            item.textContent = opt.text;

            // Apply font preview style if it's not "inherit"
            if (opt.value !== 'inherit') {
                item.style.fontFamily = opt.value;
            }

            if (opt.selected) item.classList.add('selected');

            item.addEventListener('click', (e) => {
                e.stopPropagation();

                // Update Native Select
                selectElement.value = opt.value;
                selectElement.dispatchEvent(new Event('change')); // Trigger change for app logic
                selectElement.dispatchEvent(new Event('input'));  // Trigger input for history saving

                // Update UI
                header.querySelector('.current-font').textContent = opt.text;
                list.querySelectorAll('.font-option-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                wrapper.classList.remove('open');
            });

            list.appendChild(item);
        });

        wrapper.appendChild(header);
        wrapper.appendChild(list);

        // Insert custom UI before native select
        selectElement.parentNode.insertBefore(wrapper, selectElement);

        // Toggle Logic
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other open dropdowns
            document.querySelectorAll('.custom-multiselect').forEach(ms => ms.classList.remove('open'));
            document.querySelectorAll('.custom-font-select').forEach(el => {
                if (el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });

        // Add Styles if not exist
        if (!document.getElementById('font-select-styles')) {
            const style = document.createElement('style');
            style.id = 'font-select-styles';
            style.innerHTML = `.custom-font-select { position: relative; width: 100%; font-family: 'Urbanist', sans-serif; } .font-select-header { display: flex; justify-content: space-between; align-items: center; padding: 0px 12px; height: 34px; border: 1px solid #D2DAD2; border-radius: 3px; cursor: pointer; font-size: 14px; color: #232323; background: #fff; } .font-select-header:hover { border-color: #159C2A; } .custom-font-select.open .font-select-header { border-color: #159C2A; } .custom-font-select.open .font-select-header svg { transform: rotate(180deg); } .font-options-list { display: none; position: absolute; top: calc(100% + 5px); left: 0; width: 100%; background: #fff; box-shadow: 0px 7px 20px 0px #23232326; border: 1px solid #EEEEEE; border-radius: 3px; z-index: 100; padding: 0; max-height: 200px; overflow-y: auto; } .custom-font-select.open .font-options-list { display: block; } .font-option-item { display: flex; align-items: center; height: 30px; padding: 0 10px; cursor: pointer; font-size: 12px; color: #232323; } .font-option-item:hover { background-color: #00800008; } .font-option-item.selected { background-color: #00800008; font-weight: 600; }`;
            document.head.appendChild(style);
        }
    }

    // --- Color Math Functions ---
    function hsvToHex(h, s, v) {
        s /= 100; v /= 100;
        let c = v * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = v - c;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
    }

    function hexToHsv(hex) {
        let r = 0, g = 0, b = 0;
        if (!hex) hex = "#FFFFFF";
        if (hex.startsWith('#')) hex = hex.slice(1);

        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            return { h: 0, s: 0, v: 100 };
        }

        r /= 255; g /= 255; b /= 255;
        let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
        let h = 0, s = 0, v = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;
        v = Math.round(cmax * 100);
        s = cmax === 0 ? 0 : Math.round((delta / cmax) * 100);

        return { h, s, v };
    }

    // ===========================================
    // 2. HISTORY MANAGEMENT & TOOLBAR
    // ===========================================
    function saveHistory() {
        if (historyStep < historyStack.length - 1) {
            historyStack.splice(historyStep + 1);
        }
        const state = JSON.stringify(blocksData);
        // Avoid duplicate states
        if (historyStack.length > 0 && historyStack[historyStack.length - 1] === state) {
            return;
        }
        historyStack.push(state);
        if (historyStack.length > MAX_HISTORY) {
            historyStack.shift();
        } else {
            historyStep++;
        }
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            blocksData = JSON.parse(historyStack[historyStep]);
            selectedBlockId = null;
            renderBlocks();
            updateInspectorState();
        }
    }

    function redo() {
        if (historyStep < historyStack.length - 1) {
            historyStep++;
            blocksData = JSON.parse(historyStack[historyStep]);
            selectedBlockId = null;
            renderBlocks();
            updateInspectorState();
        }
    }

    function updateInspectorState() {
        const container = document.getElementById('inspector-controls');
        if (container && selectedBlockId === null) {
            container.innerHTML = '<div class="empty-state-inspect">Select an element to edit.</div>';
        } else if (selectedBlockId) {
            renderInspectorControls(selectedBlockId);
        }
    }

    // Toolbar Listeners
    const tools = document.querySelectorAll('.tool-btn');
    tools.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = btn.dataset.mode;
            const title = btn.getAttribute('title');

            // Handle Mode Switching
            if (mode) {
                document.querySelectorAll('.tool-btn[data-mode]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Reset States
                isPreviewMode = false;
                paperElement.classList.remove('preview-active');
                canvasContainer.classList.remove('mode-code');

                if (mode === 'edit') {
                    renderBlocks();
                    if (blocksData.length > 0) selectBlock(blocksData[0].id);
                    else {
                        selectedBlockId = null;
                        updateInspectorState();
                    }
                }
                else if (mode === 'preview') {
                    isPreviewMode = true;
                    selectedBlockId = null;
                    paperElement.classList.add('preview-active');
                    renderBlocks();
                    updateInspectorState();
                }
                else if (mode === 'code') {
                    selectedBlockId = null; // Deselect
                    updateInspectorState(); // Clear inspector
                    canvasContainer.classList.add('mode-code');
                    codeEditor.textContent = generateEmailHtml();
                }
                else if (mode === 'json') {
                    selectedBlockId = null; // Deselect
                    updateInspectorState(); // Clear inspector
                    canvasContainer.classList.add('mode-code');
                    const exportData = {
                        root: {
                            type: "EmailLayout",
                            data: {
                                backdropColor: document.getElementById('style-backdrop').value,
                                canvasColor: document.getElementById('style-canvas').value,
                                fontFamily: document.getElementById('style-font').value,
                                childrenIds: blocksData.map(b => `block-${b.id}`)
                            }
                        },
                        blocks: blocksData.reduce((acc, block) => {
                            acc[`block-${block.id}`] = block;
                            return acc;
                        }, {})
                    };
                    codeEditor.textContent = JSON.stringify(exportData, null, 2);
                }
            }
            else if (title === 'Undo') {
                undo();
            }
            else if (title === 'Redo') {
                redo();
            }
        });
    });

    // ===========================================
    // HTML GENERATOR
    // ===========================================

    function generateEmailHtml() {
        // 1. Отримуємо налаштування стилів
        const bg = document.getElementById('style-backdrop').value;
        const canvasBg = document.getElementById('style-canvas').value;
        const fontFamily = document.getElementById('style-font').value;
        const textColor = document.getElementById('style-text-color').value;
        const borderRadius = document.getElementById('style-radius').value;

        // ============================================================
        // A. ОБРАБОТКА ХЕДЕРА (ИЗ ПЕРЕМЕННОЙ EMAIL_TEMPLATES)
        // ============================================================

        // Создаем временный элемент для парсинга строки хедера
        const tempHeader = document.createElement('div');
        tempHeader.innerHTML = EMAIL_TEMPLATES.header;

        // 1. Логотип
        const logoEl = tempHeader.querySelector('.header-logo');
        // Если логотип — это ссылка с SVG внутри
        const logoLink = logoEl ? logoEl.querySelector('a') : null;
        let logoHTML = '';

        if (logoLink) {
            // Оборачиваем лого в стили для письма
            logoHTML = `<a href="${logoLink.href || '#'}" target="_blank" style="text-decoration: none; display: block; border: 0;">${logoLink.innerHTML}</a>`;
        } else if (logoEl) {
            logoHTML = logoEl.innerHTML;
        }

        // 2. Соцмережі
        const socialsEl = tempHeader.querySelector('.header-socials');
        let socialsHTML = '';
        if (socialsEl) {
            const socialLinks = socialsEl.querySelectorAll('a');
            socialLinks.forEach(link => {
                const icon = link.innerHTML;
                // Добавляем inline-стили для ссылок соцсетей
                socialsHTML += `<a href="${link.href}" target="_blank" style="text-decoration: none; display: inline-block; margin-left: 5px;">${icon}</a>`;
            });
        }

        // ============================================================
        // B. ОБРАБОТКА ФУТЕРА (ИЗ ПЕРЕМЕННОЙ EMAIL_TEMPLATES)
        // ============================================================

        // Создаем временный элемент для парсинга строки футера
        const tempFooter = document.createElement('div');
        tempFooter.innerHTML = EMAIL_TEMPLATES.footer;

        // 1. Футер: Левая часть (Фото + Имя)
        const footerProfileEl = tempFooter.querySelector('.footer-profile');
        let footerLeftHTML = '';

        if (footerProfileEl) {
            const img = footerProfileEl.querySelector('img');
            const h3 = footerProfileEl.querySelector('h3'); // Имя
            const p = footerProfileEl.querySelector('p');   // Должность

            const imgSrc = img ? img.src : '';
            // Если путь относительный (../assets), в реальном письме он может не работать, 
            // но для экспорта мы оставляем как есть или можно заменить на абсолютный URL.

            const name = h3 ? h3.textContent : '';
            const role = p ? p.textContent : '';

            // Верстаем ТАБЛИЦУ для левой части
            footerLeftHTML = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" style="padding-bottom: 10px;">
                        <img src="${imgSrc}" alt="${name}" width="120" style="width: 120px; max-width: 100%; border-radius: 4px; display: block; border: 0;">
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-family: ${fontFamily}, sans-serif; font-size: 14px; font-weight: 600; color: ${textColor}; padding-bottom: 2px;">
                        ${name}
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-family: ${fontFamily}, sans-serif; font-size: 10px; color: ${textColor};">
                        ${role}
                    </td>
                </tr>
            </table>
            `;
        }

        // 2. Футер: Правая часть (Контакты, Кнопка, Дисклеймер)
        let footerRightHTML = '';
        const footerDetails = tempFooter.querySelector('.footer-details');

        if (footerDetails) {
            // a. Контакты
            const contacts = footerDetails.querySelectorAll('.fd-contact');
            let contactsRows = '';
            contacts.forEach(c => {
                const icon = c.querySelector('svg') ? c.querySelector('svg').outerHTML : '';
                // innerHTML сохраняет <span>Phone:</span> и т.д.
                const text = c.querySelector('p') ? c.querySelector('p').innerHTML : '';

                contactsRows += `
                <tr>
                    <td width="15" valign="top" style="padding-bottom: 6px; padding-right: 5px;">${icon}</td>
                    <td valign="top" style="font-family: ${fontFamily}, sans-serif; font-size: 9px; line-height: 1.4; color: ${textColor}; padding-bottom: 6px;">${text}</td>
                </tr>
                `;
            });

            // b. Соцсети в футере
            const footerSocialsDiv = footerDetails.querySelector('.fd-socials');
            let footerSocialsHTML = '';
            if (footerSocialsDiv) {
                const fLinks = footerSocialsDiv.querySelectorAll('a');
                fLinks.forEach(l => {
                    footerSocialsHTML += `<a href="${l.href}" style="text-decoration: none; display: inline-block; margin-right: 5px;">${l.innerHTML}</a>`;
                });
            }

            // c. Кнопка "Apply Now"
            const applyBtn = footerDetails.querySelector('.fd-apply-btn');
            const btnLink = applyBtn ? applyBtn.getAttribute('href') : '#';
            const btnText = applyBtn ? applyBtn.textContent : 'APPLY NOW';

            // d. Дисклеймер
            const disclaimer = footerDetails.querySelector('.fd-disclaimer p');
            const disclaimerText = disclaimer ? disclaimer.innerHTML : '';

            // Верстаем ТАБЛИЦУ для правой части
            footerRightHTML = `
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${contactsRows}
                
                <tr>
                    <td colspan="2" style="padding-top: 10px; padding-bottom: 10px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td valign="middle">
                                    ${footerSocialsHTML}
                                </td>
                                <td valign="middle" align="left">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="center" bgcolor="#159C2A" style="border-radius: 3px;">
                                                <a href="${btnLink}" target="_blank" style="font-family: ${fontFamily}, sans-serif; font-size: 9px; font-weight: 600; color: #ffffff; text-decoration: none; text-transform: uppercase; padding: 8px 18px; display: inline-block; border: 1px solid #159C2A; background-color: #159C2A; border-radius: 3px;">
                                                    ${btnText}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td colspan="2" style="font-family: ${fontFamily}, sans-serif; font-size: 7px; line-height: 1.4; color: ${textColor}99; padding-top: 5px;">
                        ${disclaimerText}
                    </td>
                </tr>
            </table>
            `;
        }

        // ============================================================
        // C. СБОРКА БЛОКОВ (DRAG & DROP CONTENT)
        // ============================================================
        let contentHTML = '';
        blocksData.forEach(block => {
            const pTop = block.styles.paddingTop;
            const pBottom = block.styles.paddingBottom;
            const pLeft = block.styles.paddingLeft;
            const pRight = block.styles.paddingRight;
            const align = block.styles.align;
            const bgCol = block.styles.bgColor === 'transparent' ? 'transparent' : block.styles.bgColor;

            let innerContent = '';

            if (block.type === 'text') {
                const s = block.styles;
                // Применяем шрифт, выбранный пользователем (fontFamily из переменной или из блока)
                const appliedFont = s.fontFamily === 'inherit' ? fontFamily : s.fontFamily;
                const fontStyle = `font-family: ${appliedFont}; font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}; color: ${s.color}; line-height: 1.5; margin: 0;`;

                if (block.isList) {
                    let listItems = '';
                    block.content.split('\n').forEach(line => {
                        if (line.trim()) listItems += `<li style="margin-bottom: 5px;">${line}</li>`;
                    });
                    innerContent = `<ul style="${fontStyle} padding-left: 20px; margin: 0;">${listItems}</ul>`;
                } else {
                    innerContent = `<div style="${fontStyle}">${block.content.replace(/\n/g, '<br>')}</div>`;
                }
            }
            else if (block.type === 'image') {
                const s = block.styles;
                const imgStyle = `width: ${s.width}; height: ${s.height}; max-width: 100%; display: inline-block; border: 0; outline: none; object-fit: ${s.objectFit};`;

                if (block.content.link) {
                    innerContent = `<a href="${block.content.link}" target="_blank" style="text-decoration: none;"><img src="${block.content.url}" alt="${block.content.alt}" style="${imgStyle}"></a>`;
                } else {
                    innerContent = `<img src="${block.content.url}" alt="${block.content.alt}" style="${imgStyle}">`;
                }
            }
            else if (block.type === 'button') {
                const s = block.styles;
                let btnRadius = '4px';
                if (s.btnStyle === 'rectangle') btnRadius = '0px';
                if (s.btnStyle === 'pill') btnRadius = '50px';

                let padTop = '12px', padSide = '24px';
                if (s.btnSize === 'xs') { padTop = '6px'; padSide = '12px'; }
                if (s.btnSize === 'sm') { padTop = '8px'; padSide = '16px'; }
                if (s.btnSize === 'lg') { padTop = '16px'; padSide = '32px'; }

                const appliedFont = s.fontFamily === 'inherit' ? fontFamily : s.fontFamily;

                innerContent = `
                <table width="${s.widthMode === 'full' ? '100%' : 'auto'}" cellpadding="0" cellspacing="0" border="0" align="${align}">
                    <tr>
                        <td align="center" bgcolor="${s.buttonColor}" style="border-radius: ${btnRadius};">
                            <a href="${block.content.link}" target="_blank" style="font-family: ${appliedFont}; font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}; color: ${s.color}; text-decoration: none; display: inline-block; padding: ${padTop} ${padSide}; border: 1px solid ${s.buttonColor}; border-radius: ${btnRadius}; background-color: ${s.buttonColor};">
                                ${block.content.text}
                            </a>
                        </td>
                    </tr>
                </table>
                `;
            }

            contentHTML += `
            <tr>
                <td align="${align}" bgcolor="${bgCol}" style="padding: ${pTop} ${pRight} ${pBottom} ${pLeft};">
                    ${innerContent} 
                </td>
            </tr>
            `;
        });


        // ============================================================
        // D. ФИНАЛЬНАЯ СБОРКА HTML (TABLE SKELETON)
        // ============================================================
        const finalHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bg}; font-family: ${fontFamily}, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="background-color: ${bg};">
        <tr>
            <td align="center" valign="top" style="padding: 40px 10px;">
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${canvasBg}" style="max-width: 600px; background-color: ${canvasBg}; border-radius: ${borderRadius}px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    
                    <tr>
                        <td style="border-bottom: 1px solid #BBBBBB; padding: 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="left" valign="middle">
                                        ${logoHTML}
                                    </td>
                                    <td align="right" valign="middle">
                                        ${socialsHTML}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    ${contentHTML}

                    <tr>
                        <td style="border-top: 1px solid #BBBBBB; padding: 20px 24px;">
                            <div style="text-align: center; font-size: 11px; color: ${textColor}CC; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; font-family: ${fontFamily}, sans-serif;">
                                POWERED BY
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="130" valign="top" style="padding-right: 15px;">
                                        ${footerLeftHTML}
                                    </td>
                                    
                                    <td valign="top">
                                        ${footerRightHTML}
                                    </td>
                                </tr>
                            </table>

                            <div style="text-align: center; font-size: 11px; color: ${textColor}CC; margin-top: 15px; font-family: ${fontFamily}, sans-serif;">
                                © Copyright Fundshop, 2019-2025
                            </div>
                        </td>
                    </tr>

                </table>
                </td>
        </tr>
    </table>

</body>
</html>`;

        return finalHtml;
    }

    // ===========================================
    // 3. CUSTOM UI LOGIC (Multiselect, Date, Color)
    // ===========================================

    // Multiselect
    const multiselects = document.querySelectorAll('.custom-multiselect');
    multiselects.forEach(ms => {
        const box = ms.querySelector('.select-box');
        const list = ms.querySelector('.options-list');
        const checkboxes = list.querySelectorAll('input[type="checkbox"]');
        updateSelectedText(ms);
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            multiselects.forEach(other => { if (other !== ms) other.classList.remove('open'); });
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));
            ms.classList.toggle('open');
        });
        checkboxes.forEach(cb => cb.addEventListener('change', () => updateSelectedText(ms)));
        list.addEventListener('click', (e) => e.stopPropagation());
    });

    // Close multiselects when clicking outside
    document.addEventListener('click', function () {
        document.querySelectorAll('.custom-multiselect').forEach(ms => {
            ms.classList.remove('open');
        });
        document.querySelectorAll('.custom-font-select').forEach(el => {
            el.classList.remove('open');
        });
    });

    function updateSelectedText(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
        const displaySpan = container.querySelector('.selected-text');
        if (checkboxes.length === 0) {
            displaySpan.textContent = "Select options";
            displaySpan.style.color = "#808080";
        } else if (checkboxes.length === 1) {
            displaySpan.textContent = checkboxes[0].parentElement.querySelector('.option-label').textContent;
            displaySpan.style.color = "#232323";
        } else {
            displaySpan.textContent = `${checkboxes.length} items selected`;
            displaySpan.style.color = "#232323";
        }
    }

    // Date Picker
    const dateTrigger = document.getElementById('date-time-trigger');
    const overlay = document.getElementById('datePickerOverlay');
    const closeBtn = document.getElementById('dpClose');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const previewDisplay = document.getElementById('previewDateTime');
    const timeHourInput = document.getElementById('timeHour');
    const timeAmpmSelect = document.getElementById('timeAmpm');

    if (dateTrigger && overlay && typeof flatpickr !== 'undefined') {
        let selectedDateObj = new Date();
        const fp = flatpickr("#inline-calendar", {
            inline: true, dateFormat: "Y-m-d", defaultDate: "today",
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) { selectedDateObj = selectedDates[0]; updatePreviewText(); }
            }
        });
        dateTrigger.addEventListener('click', () => { overlay.classList.add('active'); updatePreviewText(); });
        function closeModal() { overlay.classList.remove('active'); }
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        function updatePreviewText() {
            const datePart = fp.formatDate(selectedDateObj, "M j");
            const timePart = `${timeHourInput.value} ${timeAmpmSelect.value}`;
            if (previewDisplay) previewDisplay.textContent = `${datePart}, ${timePart}`;
        }
        if (timeHourInput) timeHourInput.addEventListener('input', updatePreviewText);
        if (timeAmpmSelect) timeAmpmSelect.addEventListener('change', updatePreviewText);
        scheduleBtn.addEventListener('click', () => {
            const datePart = fp.formatDate(selectedDateObj, "m/d/Y");
            const timePart = `${timeHourInput.value} ${timeAmpmSelect.value}`;
            dateTrigger.value = `${datePart} ${timePart}`;
            closeModal();
        });
    }

    // Color Picker
    let activeColorInput = null;
    let activeSwatch = null;
    const pickerDOM = document.createElement('div');
    pickerDOM.className = 'cp-popup';
    pickerDOM.innerHTML = `
        <div class="cp-saturation"><div class="cp-saturation-white"></div><div class="cp-saturation-black"></div><div class="cp-cursor"></div></div>
        <div class="cp-hue"><div class="cp-hue-cursor"></div></div>
        <div class="cp-presets"></div>
        <div class="cp-hex-wrapper"><span class="cp-hex-prefix">#</span><input type="text" class="cp-hex-input" maxlength="6"></div>
    `;
    document.body.appendChild(pickerDOM);

    const satBox = pickerDOM.querySelector('.cp-saturation');
    const satCursor = pickerDOM.querySelector('.cp-cursor');
    const hueBox = pickerDOM.querySelector('.cp-hue');
    const hueCursor = pickerDOM.querySelector('.cp-hue-cursor');
    const hexInput = pickerDOM.querySelector('.cp-hex-input');
    const presetsBox = pickerDOM.querySelector('.cp-presets');
    let currentHsv = { h: 0, s: 0, v: 100 };
    let isDraggingSat = false;
    let isDraggingHue = false;

    function setColorFromHex(hex) {
        currentHsv = hexToHsv(hex);
        updateUI();
        if (activeColorInput) hexInput.value = hex.replace('#', '');
    }
    function updateUI() {
        satBox.style.backgroundColor = `hsl(${currentHsv.h}, 100%, 50%)`;
        satCursor.style.left = `${currentHsv.s}%`;
        satCursor.style.top = `${100 - currentHsv.v}%`;
        hueCursor.style.left = `${(currentHsv.h / 360) * 100}%`;
        const hex = hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v);
        hexInput.value = hex.replace('#', '');
    }
    function applyColor() {
        const hex = hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v);
        if (activeColorInput && activeSwatch) {
            activeColorInput.value = hex;
            activeSwatch.style.backgroundColor = hex;
            if (activeSwatch.classList.contains('plus-swatch')) {
                activeSwatch.classList.remove('plus-swatch');
                activeSwatch.innerHTML = '';
            }
            activeColorInput.dispatchEvent(new Event('input'));
        }
    }
    function updateSatVal(e) {
        const rect = satBox.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        let y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        currentHsv.s = (x / rect.width) * 100;
        currentHsv.v = 100 - (y / rect.height) * 100;
        updateUI(); applyColor();
    }
    function updateHue(e) {
        const rect = hueBox.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        currentHsv.h = (x / rect.width) * 360;
        updateUI(); applyColor();
    }

    const presetColors = ['#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#616161', '#455A64', '#000000', '#FFFFFF', '#159C2A', '#E8F6EA', '#F5F5F5'];
    presetColors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'cp-preset-color';
        div.style.backgroundColor = color;
        div.addEventListener('click', () => {
            setColorFromHex(color);
            applyColor();
            saveHistory();
        });
        presetsBox.appendChild(div);
    });

    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.color-swatch-wrapper');
        if (!wrapper && !pickerDOM.contains(e.target)) {
            pickerDOM.classList.remove('active');
            return;
        }
        if (wrapper) {
            e.stopPropagation();
            document.querySelectorAll('.custom-multiselect').forEach(ms => ms.classList.remove('open'));
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));
            const inputId = wrapper.dataset.target;
            if (!inputId) return;
            activeColorInput = document.getElementById(inputId);
            activeSwatch = wrapper.querySelector('.color-swatch');
            const initialColor = activeColorInput.value || '#FFFFFF';
            setColorFromHex(initialColor);
            const rect = wrapper.getBoundingClientRect();
            let top = rect.bottom + window.scrollY + 5;
            if (top + 350 > document.body.scrollHeight) top = rect.top + window.scrollY - 310;
            pickerDOM.style.top = `${top}px`;
            pickerDOM.style.left = `${rect.left + window.scrollX}px`;
            pickerDOM.classList.add('active');
        }
    });

    satBox.addEventListener('mousedown', (e) => { isDraggingSat = true; updateSatVal(e); });
    hueBox.addEventListener('mousedown', (e) => { isDraggingHue = true; updateHue(e); });
    document.addEventListener('mousemove', (e) => {
        if (isDraggingSat) { e.preventDefault(); updateSatVal(e); }
        if (isDraggingHue) { e.preventDefault(); updateHue(e); }
    });
    document.addEventListener('mouseup', () => {
        if (isDraggingSat || isDraggingHue) {
            isDraggingSat = false;
            isDraggingHue = false;
            saveHistory();
        }
    });
    hexInput.addEventListener('change', () => {
        let val = hexInput.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            setColorFromHex(val);
            applyColor();
            saveHistory();
        }
    });

    // ===========================================
    // 5. BUILDER LOGIC
    // ===========================================

    saveHistory();

    const sidebarTabs = document.querySelectorAll('.sb-tab');
    const accHeaders = document.querySelectorAll('.sb-accordion-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const body = document.getElementById(header.dataset.target);
            if (body) body.classList.toggle('open');
        });
    });

    function openAccordion(id) {
        const body = document.getElementById(id);
        const header = document.querySelector(`.sb-accordion-header[data-target="${id}"]`);
        if (body && !body.classList.contains('open')) body.classList.add('open');
        if (header && !header.classList.contains('active')) header.classList.add('active');
    }

    if (sidebarTabs.length > 0) {
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sidebarTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sb-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });
    }

    const draggables = document.querySelectorAll('.draggable-item');
    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => e.dataTransfer.setData('type', item.dataset.type));
    });

    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (isPreviewMode) return;
            if (!e.dataTransfer.types.includes('sort/type')) {
                dropzone.classList.add('drag-active');
                return;
            }
            const draggingEl = document.querySelector('.dragging');
            if (draggingEl) {
                const afterElement = getDragAfterElement(dropzone, e.clientY);
                if (afterElement == null) dropzone.appendChild(draggingEl);
                else dropzone.insertBefore(draggingEl, afterElement);
            }
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-active'));

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-active');
            if (isPreviewMode) return;
            if (!e.dataTransfer.types.includes('sort/type')) {
                const type = e.dataTransfer.getData('type');
                if (type) addBlock(type);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.canvas-block:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function reorderBlocksData() {
        const currentIds = Array.from(document.querySelectorAll('.canvas-block')).map(el => parseInt(el.dataset.id));
        const newBlocksData = [];
        currentIds.forEach(id => {
            const block = blocksData.find(b => b.id === id);
            if (block) newBlocksData.push(block);
        });
        blocksData = newBlocksData;
        saveHistory();
    }

    function addBlock(type) {
        const newBlock = {
            id: Date.now(),
            type: type,
            content: getDefaultContent(type),
            isList: false,
            styles: getDefaultStyles(type)
        };
        blocksData.push(newBlock);
        saveHistory();
        renderBlocks();
        selectBlock(newBlock.id);
    }

    window.insertBlock = function (type, prevIndex) {
        const newBlock = {
            id: Date.now(),
            type: type,
            content: getDefaultContent(type),
            isList: false,
            styles: getDefaultStyles(type)
        };
        blocksData.splice(prevIndex + 1, 0, newBlock);
        saveHistory();
        renderBlocks();
        selectBlock(newBlock.id);
        document.querySelectorAll('.quick-add-menu').forEach(m => m.classList.remove('active'));
    };

    function getDefaultContent(type) {
        if (type === 'text') return 'My new text block\nSecond line';
        if (type === 'image') return { url: '../assets/images/logo_placeholder.svg', alt: 'Sample product', link: '' };
        if (type === 'button') return { text: 'Button', link: 'https://example.com' };
        return '';
    }

    function getDefaultStyles(type) {
        const base = { paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', align: 'left', fontFamily: 'inherit', fontSize: '16', fontWeight: 'normal', color: '#232323', bgColor: 'transparent' };
        if (type === 'button') {
            return { ...base, align: 'center', buttonColor: '#808080', color: '#FFFFFF', widthMode: 'auto', btnSize: 'md', btnStyle: 'rounded', paddingTop: '10px', paddingBottom: '10px', bgColor: 'transparent' };
        }
        if (type === 'image') {
            return { ...base, align: 'center', width: 'auto', height: 'auto', verticalAlign: 'middle', objectFit: 'fill', bgColor: 'transparent' };
        }
        return base;
    }

    // ===========================================
    // HELPER: Generate Block Content HTML String
    // ===========================================
    function generateBlockContentHTML(block) {
        if (block.type === 'text') {
            const s = block.styles;
            const textStyles = `font-family: ${s.fontFamily === 'inherit' ? 'inherit' : s.fontFamily}; font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}; color: ${s.color}; line-height: 1.5; margin: 0;`;
            if (block.isList) {
                const lines = block.content.split('\n').filter(line => line.trim() !== '');
                const listItems = lines.map(line => `<li>${line}</li>`).join('');
                return `<ul style="${textStyles}; padding-left: 30px; margin-left: 0; text-align: ${s.align}; list-style-type: disc; list-style-position: inside;">${listItems}</ul>`;
            } else {
                const formattedContent = block.content.replace(/\n/g, '<br>');
                return `<div class="inner-text" style="${textStyles}">${formattedContent}</div>`;
            }
        } else if (block.type === 'image') {
            let objPos = 'center';
            if (block.styles.verticalAlign === 'top') objPos = 'top';
            if (block.styles.verticalAlign === 'bottom') objPos = 'bottom';
            const imgStyle = `max-width: 100%; width: ${block.styles.width}; height: ${block.styles.height}; display: inline-block; vertical-align: ${block.styles.verticalAlign || 'middle'}; object-fit: ${block.styles.objectFit || 'fill'}; object-position: ${objPos};`;
            let imgHtml = `<img src="${block.content.url}" alt="${block.content.alt}" style="${imgStyle}">`;
            if (block.content.link) {
                return `<a href="${block.content.link}" target="_blank" style="display: inline-block;">${imgHtml}</a>`;
            } else {
                return imgHtml;
            }
        } else if (block.type === 'button') {
            let btnPad = '12px 24px';
            if (block.styles.btnSize === 'xs') btnPad = '6px 12px';
            if (block.styles.btnSize === 'sm') btnPad = '8px 16px';
            if (block.styles.btnSize === 'md') btnPad = '12px 24px';
            if (block.styles.btnSize === 'lg') btnPad = '16px 32px';
            let borderRadius = '4px';
            if (block.styles.btnStyle === 'rectangle') borderRadius = '0px';
            if (block.styles.btnStyle === 'rounded') borderRadius = '4px';
            if (block.styles.btnStyle === 'pill') borderRadius = '50px';
            const displayType = block.styles.widthMode === 'full' ? 'block' : 'inline-block';
            const widthStyle = block.styles.widthMode === 'full' ? '100%' : 'auto';
            const btnStyle = `display: ${displayType}; width: ${widthStyle}; background-color: ${block.styles.buttonColor}; color: ${block.styles.color}; padding: ${btnPad}; text-decoration: none; border-radius: ${borderRadius}; font-family: ${block.styles.fontFamily === 'inherit' ? 'inherit' : block.styles.fontFamily}; font-size: ${block.styles.fontSize}px; font-weight: ${block.styles.fontWeight}; text-align: ${block.styles.align}; border: none; cursor: pointer; box-sizing: border-box;`;

            return `<a href="${block.content.link}" style="${btnStyle}" target="_blank">${block.content.text}</a>`;
        }
        return '';
    }

    // ===========================================
    // HELPER: Attach Listeners to Block Element
    // ===========================================
    function attachBlockEvents(el, blockId, index) {
        // Prevent link clicks in edit mode
        const links = el.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!isPreviewMode) {
                    e.preventDefault();
                }
            });
        });

        // Click to select
        el.addEventListener('click', (e) => {
            if (isPreviewMode) return;
            e.stopPropagation();
            document.querySelectorAll('.quick-add-menu').forEach(m => m.classList.remove('active'));
            selectBlock(blockId);
        });
    }

    // ===========================================
    // MAIN RENDER FUNCTION (DIFFING / SMART UPDATE)
    // ===========================================
    function renderBlocks() {
        if (!dropzone) return;
        if (document.querySelector('.dragging')) return;

        // 1. Remove deleted blocks from DOM
        const currentIds = blocksData.map(b => String(b.id));
        Array.from(dropzone.children).forEach(child => {
            if (child.classList.contains('empty-state-message')) return;
            if (child.dataset.id && !currentIds.includes(child.dataset.id)) {
                child.remove();
            }
        });

        // 2. Handle Empty State
        if (blocksData.length === 0) {
            dropzone.innerHTML = `<div class="empty-state-message"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><p>Drop content here</p></div>`;
            return;
        } else {
            const emptyMsg = dropzone.querySelector('.empty-state-message');
            if (emptyMsg) emptyMsg.remove();
        }

        // 3. Loop and Sync
        blocksData.forEach((block, index) => {
            let el = dropzone.querySelector(`.canvas-block[data-id="${block.id}"]`);
            const isNew = !el;

            if (isNew) {
                el = document.createElement('div');
                el.classList.add('canvas-block');
                el.dataset.id = block.id;
                // Add event listeners only once on creation
                attachBlockEvents(el, block.id, index);
            }

            // Update DOM Order
            // Check if element is at the correct position
            if (dropzone.children[index] !== el) {
                dropzone.insertBefore(el, dropzone.children[index]);
            }

            // Update Wrapper Styles (Padding, Align, BG)
            // We update these every time because checking diffs for all styles is tedious vs setting them.
            el.dataset.index = index;
            el.style.padding = `${block.styles.paddingTop} ${block.styles.paddingRight} ${block.styles.paddingBottom} ${block.styles.paddingLeft}`;
            el.style.textAlign = block.styles.align;
            el.style.backgroundColor = block.styles.bgColor;

            // Selection State
            if (block.id === selectedBlockId) el.classList.add('selected');
            else el.classList.remove('selected');

            // --- CONTENT UPDATE STRATEGY (Anti-Flicker) ---
            const contentHtml = generateBlockContentHTML(block);

            // Temporarily remove controls (handle, add btn) from DOM check to compare pure content
            const controls = el.querySelectorAll('.block-handle, .block-add-trigger, .quick-add-menu');
            controls.forEach(c => c.remove());

            // Image Optimization: Prevent src reload if URL is same
            if (block.type === 'image' && !isNew) {
                const img = el.querySelector('img');
                const link = el.querySelector('a'); // If image is wrapped in link

                // Determine if we need a full innerHTML replace
                let needFullReload = false;

                // If link status changed (added/removed link), we need reload structure
                if ((block.content.link && !link) || (!block.content.link && link)) {
                    needFullReload = true;
                }
                // If img tag is missing (weird case), reload
                else if (!img) {
                    needFullReload = true;
                }
                // If URL changed, reload
                else if (img.getAttribute('src') !== block.content.url) {
                    needFullReload = true;
                }

                if (needFullReload) {
                    el.innerHTML = contentHtml;
                } else {
                    // SMART UPDATE: Update image attributes directly without touching innerHTML
                    // Styles are in `contentHtml`, but parsing it is hard.
                    // Instead, let's re-apply styles from `block.styles` directly to the element.
                    let objPos = 'center';
                    if (block.styles.verticalAlign === 'top') objPos = 'top';
                    if (block.styles.verticalAlign === 'bottom') objPos = 'bottom';

                    img.style.maxWidth = '100%';
                    img.style.width = block.styles.width;
                    img.style.height = block.styles.height;
                    img.style.display = 'inline-block';
                    img.style.verticalAlign = block.styles.verticalAlign || 'middle';
                    img.style.objectFit = block.styles.objectFit || 'fill';
                    img.style.objectPosition = objPos;
                    img.alt = block.content.alt;

                    if (block.content.link && link) {
                        link.href = block.content.link;
                        link.style.display = 'inline-block';
                    }
                }
            } else {
                // For Text and Button blocks, or New blocks:
                // Compare HTML strings. Only write if different.
                if (el.innerHTML !== contentHtml) {
                    el.innerHTML = contentHtml;
                }
            }

            // --- RE-APPEND CONTROLS IF SELECTED ---
            // Because we stripped them above, we must put them back if selected.
            if (!isPreviewMode && block.id === selectedBlockId) {
                // Handle
                const handle = document.createElement('div');
                handle.className = 'block-handle';
                handle.draggable = true;
                handle.innerHTML = `<svg width="4" height="16" viewBox="0 0 4 16" fill="none"><circle cx="2" cy="2" r="2" fill="white"/><circle cx="2" cy="8" r="2" fill="white"/><circle cx="2" cy="14" r="2" fill="white"/></svg>`;
                handle.addEventListener('dragstart', (e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData('sort/type', 'block-sort');
                    e.dataTransfer.effectAllowed = 'move';
                    setTimeout(() => el.classList.add('dragging'), 0);
                });
                handle.addEventListener('dragend', (e) => {
                    el.classList.remove('dragging');
                    reorderBlocksData();
                });
                el.appendChild(handle);

                // Add Trigger
                const addBtn = document.createElement('div');
                addBtn.className = 'block-add-trigger';
                addBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;

                // Menu
                const menu = document.createElement('div');
                menu.className = 'quick-add-menu';
                menu.innerHTML = `
                    <div class="quick-add-item" onclick="window.insertBlock('image', ${index})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><span>Image</span></div>
                    <div class="quick-add-item" onclick="window.insertBlock('text', ${index})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="18" y2="18"></line></svg><span>Text</span></div>
                    <div class="quick-add-item" onclick="window.insertBlock('button', ${index})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="8" width="16" height="8" rx="2"></rect></svg><span>Button</span></div>
                `;

                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.quick-add-menu').forEach(m => m.classList.remove('active'));
                    menu.classList.toggle('active');
                });
                menu.addEventListener('click', (e) => e.stopPropagation());

                el.appendChild(addBtn);
                el.appendChild(menu);
            }

            if (isNew) {
                dropzone.appendChild(el);
            }
        });
    }

    function selectBlock(id) {
        selectedBlockId = id;
        renderBlocks();
        renderInspectorControls(id);
        openAccordion('acc-inspect');
    }

    // ===========================================
    // 6. INSPECTOR RENDERER (UPDATED for FONTS)
    // ===========================================
    function renderInspectorControls(id) {
        const blockId = parseInt(id);
        const block = blocksData.find(b => b.id === blockId);
        const controlsContainer = document.getElementById('inspector-controls');
        if (!block || !controlsContainer) return;

        let html = '';
        // Common icons & helpers
        const padSlider = (labelIcon, prop, val) => `<div class="slider-row compact"><span class="icon-label-img">${labelIcon}</span><input type="range" min="0" max="100" value="${parseInt(val)}" oninput="document.getElementById('p-${prop}-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.${prop}', this.value + 'px', false)" class="style-range"><span class="val-label" id="p-${prop}-${blockId}">${val}</span></div>`;
        const iconTop = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1H11M6 3V11" stroke="#232323" stroke-width="1.5"/><path d="M1 1H11" stroke="#232323" stroke-width="2"/></svg>`;
        const iconBottom = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11H11M6 9V1" stroke="#232323" stroke-width="1.5"/><path d="M1 11H11" stroke="#232323" stroke-width="2"/></svg>`;
        const iconLeft = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1V11M3 6H11" stroke="#232323" stroke-width="1.5"/><path d="M1 1V11" stroke="#232323" stroke-width="2"/></svg>`;
        const iconRight = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 1V11M9 6H1" stroke="#232323" stroke-width="1.5"/><path d="M11 1V11" stroke="#232323" stroke-width="2"/></svg>`;

        const renderAlignControl = (alignVal) => `<div class="insp-group"><label class="insp-label">Alignment</label><div class="segmented-control icon-mode"><button class="${alignVal === 'left' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'left')"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M0 5H10M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg></button><button class="${alignVal === 'center' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'center')"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M2 5H12M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg></button><button class="${alignVal === 'right' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'right')"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M4 5H14M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg></button></div></div>`;
        const renderBgColor = (bgVal) => {
            const hasBgColor = bgVal && bgVal !== 'transparent';
            const bgPlusClass = hasBgColor ? '' : 'plus-swatch';
            const bgSvg = hasBgColor ? '' : `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="#808080" stroke-linecap="round"/></svg>`;
            const bgDisplayColor = bgVal === 'transparent' ? '#fff' : bgVal;
            return `<div class="insp-group"><label class="insp-label">Background color</label><div class="color-swatch-wrapper" data-target="inp-bg-color-${blockId}"><input type="text" id="inp-bg-color-${blockId}" class="color-input-hidden" value="${bgVal}" oninput="window.updateBlock('${blockId}', 'styles.bgColor', this.value, false)" hidden><div class="color-swatch ${bgPlusClass}" style="background-color: ${bgDisplayColor}">${bgSvg}</div></div></div>`;
        };
        const renderColorPicker = (label, propName, colorVal) => {
            const hasColor = colorVal && colorVal !== 'transparent';
            const plusClass = hasColor ? '' : 'plus-swatch';
            const svgIcon = hasColor ? '' : `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="#808080" stroke-linecap="round"/></svg>`;
            const displayColor = colorVal === 'transparent' ? '#fff' : colorVal;
            return `<div class="insp-group"><label class="insp-label">${label}</label><div class="color-swatch-wrapper" data-target="inp-${propName}-${blockId}"><input type="text" id="inp-${propName}-${blockId}" class="color-input-hidden" value="${colorVal}" oninput="window.updateBlock('${blockId}', 'styles.${propName}', this.value, false)" hidden><div class="color-swatch ${plusClass}" style="background-color: ${displayColor}">${svgIcon}</div></div></div>`;
        };

        if (block.type === 'text') {
            html += `<div class="insp-section-title">TEXT BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Content</label><textarea class="insp-textarea" rows="4" oninput="window.updateBlock('${blockId}', 'content', this.value, false)">${block.content}</textarea></div>`;
            html += `<div class="insp-group flex-row-center"><label class="switch"><input type="checkbox" ${block.isList ? 'checked' : ''} onchange="window.updateBlock('${blockId}', 'isList', this.checked)"><span class="slider round"></span></label><span class="insp-label-inline">Markdown (List)</span></div>`;
            html += renderColorPicker('Text color', 'color', block.styles.color);
            html += renderBgColor(block.styles.bgColor);

            // --- UPDATED FONT SELECT FOR INSPECTOR ---
            html += `<div class="insp-group"><label class="insp-label">Font family</label><select id="insp-font-${blockId}" class="insp-select" onchange="window.updateBlock('${blockId}', 'styles.fontFamily', this.value)"></select></div>`;

            html += `<div class="insp-group"><label class="insp-label">Font size</label><div class="slider-row"><span class="icon-label">Tt</span><input type="range" min="10" max="60" value="${block.styles.fontSize}" oninput="document.getElementById('fs-val-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.fontSize', this.value, false)" class="style-range"><span class="val-label" id="fs-val-${blockId}">${block.styles.fontSize}px</span></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Font weight</label><div class="segmented-control"><button class="${block.styles.fontWeight === 'normal' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'normal')">Regular</button><button class="${block.styles.fontWeight === 'bold' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'bold')">Bold</button></div></div>`;
            html += renderAlignControl(block.styles.align);
            html += `<div class="insp-group"><label class="insp-label">Padding</label>${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}</div>`;

        } else if (block.type === 'button') {
            html += `<div class="insp-section-title">BUTTON BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Text</label><input type="text" class="insp-input" value="${block.content.text}" oninput="window.updateBlock('${blockId}', 'content.text', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Url</label><input type="text" class="insp-input" value="${block.content.link}" oninput="window.updateBlock('${blockId}', 'content.link', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Width</label><div class="segmented-control"><button class="${block.styles.widthMode === 'full' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.widthMode', 'full')">Full</button><button class="${block.styles.widthMode === 'auto' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.widthMode', 'auto')">Auto</button></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Size</label><div class="segmented-control"><button class="${block.styles.btnSize === 'xs' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'xs')">Xs</button><button class="${block.styles.btnSize === 'sm' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'sm')">Sm</button><button class="${block.styles.btnSize === 'md' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'md')">Md</button><button class="${block.styles.btnSize === 'lg' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'lg')">Lg</button></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Style</label><div class="segmented-control"><button class="${block.styles.btnStyle === 'rectangle' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnStyle', 'rectangle')">Rectangle</button><button class="${block.styles.btnStyle === 'rounded' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnStyle', 'rounded')">Rounded</button><button class="${block.styles.btnStyle === 'pill' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnStyle', 'pill')">Pill</button></div></div>`;
            html += renderColorPicker('Text color', 'color', block.styles.color);
            html += renderColorPicker('Button color', 'buttonColor', block.styles.buttonColor);
            html += renderColorPicker('Background color', 'bgColor', block.styles.bgColor);

            // --- UPDATED FONT SELECT FOR INSPECTOR ---
            html += `<div class="insp-group"><label class="insp-label">Font family</label><select id="insp-font-${blockId}" class="insp-select" onchange="window.updateBlock('${blockId}', 'styles.fontFamily', this.value)"></select></div>`;

            html += `<div class="insp-group"><label class="insp-label">Font size</label><div class="slider-row"><span class="icon-label">Tt</span><input type="range" min="10" max="60" value="${block.styles.fontSize}" oninput="document.getElementById('fs-val-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.fontSize', this.value, false)" class="style-range"><span class="val-label" id="fs-val-${blockId}">${block.styles.fontSize}px</span></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Font weight</label><div class="segmented-control"><button class="${block.styles.fontWeight === 'normal' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'normal')">Regular</button><button class="${block.styles.fontWeight === 'bold' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'bold')">Bold</button></div></div>`;
            html += renderAlignControl(block.styles.align);
            html += `<div class="insp-group"><label class="insp-label">Padding</label>${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}</div>`;

        } else if (block.type === 'image') {
            html += `<div class="insp-section-title">IMAGE BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Source URL</label><input type="text" class="insp-input" value="${block.content.url}" oninput="window.updateBlock('${blockId}', 'content.url', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Alt text</label><input type="text" class="insp-input" value="${block.content.alt}" oninput="window.updateBlock('${blockId}', 'content.alt', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Click through URL</label><input type="text" class="insp-input" value="${block.content.link}" oninput="window.updateBlock('${blockId}', 'content.link', this.value, false)"></div>`;
            html += `<div class="insp-half-row"><div class="insp-half-col"><label class="insp-label">Width</label><div class="input-wrapper-suffix"><input type="text" class="insp-input insp-input-with-suffix" placeholder="auto" value="${block.styles.width === 'auto' ? '' : block.styles.width.replace('px', '')}" oninput="window.updateBlock('${blockId}', 'styles.width', this.value ? this.value + 'px' : 'auto', false)"><span class="input-suffix">px</span></div></div><div class="insp-half-col"><label class="insp-label">Height</label><div class="input-wrapper-suffix"><input type="text" class="insp-input insp-input-with-suffix" placeholder="auto" value="${block.styles.height === 'auto' ? '' : block.styles.height.replace('px', '')}" oninput="window.updateBlock('${blockId}', 'styles.height', this.value ? this.value + 'px' : 'auto', false)"><span class="input-suffix">px</span></div></div></div>`;
            html += `<div class="insp-group" style="margin-top:15px;"><label class="insp-label">Alignment (Vertical)</label><div class="segmented-control icon-mode"><button class="${block.styles.verticalAlign === 'top' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.verticalAlign', 'top')" title="Top"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5h14M12 5v14m-4-4 4 4 4-4"/></svg></button><button class="${block.styles.verticalAlign === 'middle' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.verticalAlign', 'middle')" title="Middle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18" /><path d="M12 2v10m-4-4 4 4 4-4" /><path d="M12 22v-10m-4 4 4-4 4 4" /></svg></button><button class="${block.styles.verticalAlign === 'bottom' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.verticalAlign', 'bottom')" title="Bottom"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 19h14M12 5v14m-4-10 4-4 4 4"/></svg></button></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Image Fit</label><div class="segmented-control"><button class="${block.styles.objectFit === 'fill' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.objectFit', 'fill')">Fill</button><button class="${block.styles.objectFit === 'contain' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.objectFit', 'contain')">Contain</button><button class="${block.styles.objectFit === 'cover' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.objectFit', 'cover')">Cover</button></div></div>`;
            html += renderBgColor(block.styles.bgColor);
            html += renderAlignControl(block.styles.align);
            html += `<div class="insp-group"><label class="insp-label">Padding</label>${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}</div>`;
        }

        html += `<div style="margin-top:20px; padding-top:15px; border-top:1px solid #eee;"><button onclick="window.deleteBlock(${blockId})" style="width:100%; color:#d32f2f; background:#FFF5F5; border:1px solid #FFCDCD; padding:8px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Delete Block</button></div>`;

        controlsContainer.innerHTML = html;

        // Initialize Custom Font Select for Inspector
        const fontSelect = document.getElementById(`insp-font-${blockId}`);
        if (fontSelect) {
            populateFontSelect(fontSelect, true); // Include 'inherit'
            fontSelect.value = block.styles.fontFamily;
            initCustomSelect(fontSelect);
        }
    }

    window.updateBlock = function (id, path, value, save = true) {
        const blockId = parseInt(id);
        const block = blocksData.find(b => b.id === blockId);
        if (!block) return;
        if (path.includes('.')) { const [p, c] = path.split('.'); block[p][c] = value; } else { block[path] = value; }
        renderBlocks();
        if (save) saveHistory();
        const needsRender = ['isList', 'styles.align', 'styles.fontWeight', 'styles.verticalAlign', 'styles.objectFit', 'styles.widthMode', 'styles.btnSize', 'styles.btnStyle'].some(k => path.includes(k));
        if (needsRender) renderInspectorControls(blockId);
    };

    window.deleteBlock = function (id) {
        blocksData = blocksData.filter(b => b.id !== id);
        saveHistory();
        const c = document.getElementById('inspector-controls');
        if (c) c.innerHTML = '<div class="empty-state-inspect">Element deleted. Select another.</div>';
        selectedBlockId = null;
        renderBlocks();
    };

    document.addEventListener('change', (e) => {
        if (e.target.matches('.style-range, .color-input-hidden, .insp-input, .insp-select') || e.target.tagName === 'TEXTAREA') saveHistory();
    });

    // ===========================================
    // 7. INITIALIZATION FOR GLOBAL STYLES
    // ===========================================
    const backdropInput = document.getElementById('style-backdrop');
    const canvasInput = document.getElementById('style-canvas');
    const borderColorInput = document.getElementById('style-border-color');
    const radiusInput = document.getElementById('style-radius');
    const fontInput = document.getElementById('style-font');
    const textColorInput = document.getElementById('style-text-color');

    function updateSwatch(input, swatchEl) {
        if (swatchEl) {
            swatchEl.style.backgroundColor = input.value;
            if (swatchEl.id === 'swatch-border-color') { swatchEl.innerHTML = ''; swatchEl.classList.remove('plus-swatch'); }
        }
    }

    if (backdropInput && canvasContainer) {
        backdropInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-backdrop'));
            canvasContainer.style.backgroundColor = e.target.value;
        });
    }

    if (canvasInput && paperElement) canvasInput.addEventListener('input', (e) => { updateSwatch(e.target, document.getElementById('swatch-canvas')); paperElement.style.backgroundColor = e.target.value; });
    if (borderColorInput && paperElement) borderColorInput.addEventListener('input', (e) => { updateSwatch(e.target, document.getElementById('swatch-border-color')); paperElement.style.border = `1px solid ${e.target.value}`; });
    if (radiusInput && paperElement) { radiusInput.value = 0; radiusInput.addEventListener('input', (e) => { document.getElementById('radius-val').textContent = e.target.value + 'px'; paperElement.style.borderRadius = e.target.value + 'px'; }); }

    // --- GLOBAL FONT SELECTOR INIT ---
    if (fontInput && paperElement) {
        // Populate global font select (without 'inherit', because this IS the root setting)
        populateFontSelect(fontInput, false);

        // Initialize Custom UI
        initCustomSelect(fontInput);

        // Add Listener
        fontInput.addEventListener('change', (e) => paperElement.style.fontFamily = e.target.value);
    }

    if (textColorInput && paperElement) textColorInput.addEventListener('input', (e) => { updateSwatch(e.target, document.getElementById('swatch-text-color')); paperElement.style.color = e.target.value; paperElement.querySelectorAll('.static-header, .static-footer, .footer-details p').forEach(el => el.style.color = e.target.value); });

    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const mainOverlay = document.querySelector('.overlay');
    if (burger && closeBurger && sideBar && mainOverlay) {
        burger.addEventListener('click', () => { sideBar.style.transform = 'translateX(0)'; mainOverlay.style.display = 'flex'; });
        closeBurger.addEventListener('click', () => { sideBar.style.transform = 'translateX(-120%)'; mainOverlay.style.display = 'none'; });
    }

    // ===========================================
    // 8. IMPORT/EXPORT & VIEW MODES
    // ===========================================

    // --- Export JSON ---
    document.getElementById('btn-export-json').addEventListener('click', () => {
        const exportData = {
            root: {
                type: "EmailLayout",
                data: {
                    backdropColor: document.getElementById('style-backdrop').value,
                    canvasColor: document.getElementById('style-canvas').value,
                    fontFamily: document.getElementById('style-font').value,
                    textColor: document.getElementById('style-text-color').value,
                    borderRadius: document.getElementById('style-radius').value,
                    meta: {
                        senderName: document.getElementById('sender-name')?.value || '',
                        senderEmail: document.getElementById('sender-email')?.value || '',
                        subject: document.getElementById('email-subject')?.value || ''
                    }
                }
            },
            blocks: blocksData
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "email_template.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // --- Import JSON Modal Logic ---
    const importModal = document.getElementById('importJsonModal');
    const importTextArea = document.getElementById('import-json-area');

    document.getElementById('btn-import-json').addEventListener('click', () => {
        importTextArea.value = '';
        importModal.classList.add('active');
    });

    function closeImportModal() {
        importModal.classList.remove('active');
    }
    document.getElementById('closeJsonModal').addEventListener('click', closeImportModal);
    document.getElementById('cancelJsonImport').addEventListener('click', closeImportModal);
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) closeImportModal();
    });

    document.getElementById('confirmJsonImport').addEventListener('click', () => {
        try {
            const raw = importTextArea.value;
            if (!raw.trim()) return;

            const parsed = JSON.parse(raw);

            // 1. Restore Blocks
            if (parsed.blocks && Array.isArray(parsed.blocks)) {
                blocksData = parsed.blocks;
            } else if (parsed.blocks && typeof parsed.blocks === 'object') {
                blocksData = Object.values(parsed.blocks);
            }

            // 2. Restore Settings
            if (parsed.root && parsed.root.data) {
                const d = parsed.root.data;

                if (d.backdropColor) {
                    document.getElementById('style-backdrop').value = d.backdropColor;
                    document.getElementById('style-backdrop').dispatchEvent(new Event('input'));
                }
                if (d.canvasColor) {
                    document.getElementById('style-canvas').value = d.canvasColor;
                    document.getElementById('style-canvas').dispatchEvent(new Event('input'));
                }
                if (d.fontFamily) {
                    document.getElementById('style-font').value = d.fontFamily;
                    document.getElementById('style-font').dispatchEvent(new Event('change'));
                }
                if (d.textColor) {
                    document.getElementById('style-text-color').value = d.textColor;
                    document.getElementById('style-text-color').dispatchEvent(new Event('input'));
                }
                if (d.borderRadius) {
                    document.getElementById('style-radius').value = d.borderRadius;
                    document.getElementById('style-radius').dispatchEvent(new Event('input'));
                }

                if (d.meta) {
                    if (document.getElementById('sender-name')) document.getElementById('sender-name').value = d.meta.senderName;
                    if (document.getElementById('sender-email')) document.getElementById('sender-email').value = d.meta.senderEmail;
                    if (document.getElementById('email-subject')) document.getElementById('email-subject').value = d.meta.subject;
                }
            }

            // 3. Rerender
            selectedBlockId = null;
            renderBlocks();
            updateInspectorState();
            saveHistory();
            closeImportModal();

        } catch (e) {
            alert("Invalid JSON format");
            console.error(e);
        }
    });

    // --- View Toggles (Desktop/Mobile) ---
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const viewType = btn.dataset.view;
            if (viewType === 'mobile') {
                paperElement.classList.add('mobile-view');
            } else {
                paperElement.classList.remove('mobile-view');
            }
        });
    });

    // --- Export HTML ---
    const btnExportHtml = document.getElementById('btn-export-html');
    if (btnExportHtml) {
        btnExportHtml.addEventListener('click', () => {
            const htmlContent = generateEmailHtml();
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'email-template.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});