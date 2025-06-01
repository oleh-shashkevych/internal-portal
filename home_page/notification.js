function removeNotificationItmTopBar(nid, byid, pathsend) {
	const notifErrbl = document.querySelector('.notif_remove_ress');
	const btnDngr = document.querySelector('.btn.notification_itm_ico span');
	const modalBody = document.querySelector('.modal_body_pos_centr');

	notifErrbl.style.display = 'none'; // скрыть уведомление

	if (nid && byid && pathsend) {
		fetch(pathsend, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === true) {
					notifErrbl.innerHTML =
						"<p class='notif_st_tru'>Removed successfully</p>";
					notifErrbl.style.display = 'block'; // показать уведомление
					document.getElementById(byid).style.display = 'none';

					if (data.count === 0) {
						btnDngr.classList.remove('notification_linck_itm_ico_dngr');
						btnDngr.classList.add('notification_linck_itm_ico_none');
						modalBody.innerHTML =
							"<div class='notif_none'>There are no messages.</div>";
					}
				} else if (data.status === false) {
					notifErrbl.innerHTML = `<p class='notif_st_false'>${data.msg}</p>`;
					notifErrbl.style.display = 'block'; // показать уведомление
				}
			})
			.catch(error => {
				let errorMsg = '';
				if (error.name === 'TypeError') {
					errorMsg = 'Not connect. Verify Network.';
				} else if (error.name === 'SyntaxError') {
					errorMsg = 'Requested JSON parse failed.';
				} else {
					errorMsg = 'Uncaught Error: ' + error.message;
				}
				notifErrbl.innerHTML = `<p class='notif_st_false'>${errorMsg}</p>`;
				notifErrbl.style.display = 'block'; // показать уведомление
			});
	} else {
		console.log('Arguments are empty');
	}
}
