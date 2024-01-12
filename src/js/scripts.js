function extractInfo() {
    const textData = document.getElementById('textData').value;
    const infoContainer = document.getElementById('resultList');
    const resultHeader = document.getElementById('resultHeader');

    const WANTED_INFO = ['*HW_XG_WAVE_LENGTH_ALPHA1 ', '*HW_XG_WAVE_LENGTH_ALPHA2 ',
        '*HW_XG_WAVE_LENGTH_BETA ', 'MEAS_SCAN_MODE ', 'MEAS_SCAN_SPEED ',
        'MEAS_SCAN_START ', 'MEAS_SCAN_STOP ', 'MEAS_SCAN_STEP '];
    const DATA_MARKER = '#Attenuator_coefficient=1.0000';

    try {
        const lines = textData.split('\n');

        let dataFound = false;
        for (const line of lines) {
            if (line.includes(DATA_MARKER)) {
                dataFound = true;
                break;
            }
        }

        if (dataFound) {
            resultHeader.style.display = 'block';
            infoContainer.innerHTML = '';

            const infoMap = {};
            for (const info of WANTED_INFO) {
                for (const line of lines) {
                    if (line.includes(info)) {
                        infoMap[info] = line.trim();
                        break;
                    }
                }
            }

            for (const [key, value] of Object.entries(infoMap)) {
                const listItem = document.createElement('li');
                listItem.textContent = `${key}: ${value}`;
                infoContainer.appendChild(listItem);
            }
        } else {
            resultHeader.style.display = 'none';
            infoContainer.innerHTML = '';
            alert('데이터 마커를 찾지 못했습니다.');
        }
    } catch (error) {
        resultHeader.style.display = 'none';
        infoContainer.innerHTML = '';
        alert(error.message);
    }
}
