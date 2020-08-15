function getError(code) {
    switch (Number(code)) {
        case 1000:
            return 'Sorry, Invalid Values Detected';
        case 1001:
            return 'Sorry, the Body is not an object';
        case 1002:
            return 'Sorry, the prefix cannot exceed more than 5 characters';
        case 1003:
            return 'Sorry, that\'s an Invalid or Unknown Channel';
        case 1004:
            return 'Sorry, that\'s an Invalid or Unknown Category Channel';
        case 1005:
            return 'Sorry, that\'s an Invalid or Unknown Voice Channel';
        case 1006:
            return 'Sorry, that\'s an Invalid or Unknown Action';
        case 1007:
            return 'Sorry, that\'s an Invalid or Unknown Role';
        case 1008:
            return 'Sorry, that\'s an Invalid or Unknown Verification Type';
        case 1009:
            return 'Sorry, the Welcome/Farewell Message cannot exceed more than 1024 characters';
        case 1010: {
            return 'Sorry, you need to put a valid duration';
        }
        case 1011: {
            return 'Sorry, Warn Threshold should be a number';
        }
        case 1012: {
            return 'Sorry, that is not a Boolean';
        }
        default:
            return 'Sorry, Unknown validation error occured';
    }
}
window.onload = () => {
    if (window.location.href.includes('?success=true')) {
        Swal.fire({
            icon: 'success',
            position: 'bottom-end',
            title: 'Your changes has been saved!',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
        }).then(() => {
            window.location.href = window.location.href.replace('?success=true', '')
        });
    } else if (window.location.href.includes('?error=')) {
        const matches = window.location.href.match(/\?error=[0-9][0-9][0-9][0-9]/g);
        if (matches) {
            const code = matches[0].split('=')[1];
            Swal.fire({
                icon: 'error',
                position: 'bottom-end',
                title: `${code} ${getError(code)}`,
                toast: true,
            }).then(() => {
                window.location.href = window.location.href.replace(/\?error=[0-9][0-9][0-9][0-9]/g, '')
            });
        }
    }
};