document.addEventListener('DOMContentLoaded', function () {
    console.log('Email page loaded');

    // ==========================================================================
    // 1. GENERAL UI HANDLERS (SIDEBAR & TABS)
    // ==========================================================================

    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const overlay = document.querySelector('.overlay');

    // --- Mobile Sidebar (Burger Menu) ---
    if (burger && closeBurger && sideBar && overlay) {
        burger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(0)';
            overlay.style.display = 'flex';
        });

        closeBurger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(-120%)';
            overlay.style.display = 'none';
        });
    }

    // ==========================================================================
    // 2. EMAIL PAGE TABS LOGIC
    // ==========================================================================
    const tabs = document.querySelectorAll('.email-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            tab.classList.add('active');

            // Show content
            const targetId = tab.getAttribute('data-tab') + '-view';
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. ACTION MENU TOGGLE (Using Event Delegation)
    // ==========================================================================
    document.addEventListener('click', function (e) {
        // Handle Action Button Click
        if (e.target.closest('.action-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn');
            const dropdown = btn.nextElementSibling;

            // Close all other open dropdowns first
            document.querySelectorAll('.action-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('show');
            });

            // Toggle current
            dropdown.classList.toggle('show');
            e.stopPropagation();
        }
        // Close if clicked outside
        else if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown').forEach(d => {
                d.classList.remove('show');
            });
        }
    });

    // Handle Edit/Delete clicks (Mock functionality)
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('dropdown-item')) {
            e.preventDefault();
            const action = e.target.classList.contains('edit') ? 'Edit' : 'Delete';
            console.log(`${action} clicked on campaign`);
            // Hide dropdown after selection
            e.target.closest('.action-dropdown').classList.remove('show');
        }
    });
});