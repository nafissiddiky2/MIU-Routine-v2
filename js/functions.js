// ============================================
// SHARED UTILITY FUNCTIONS
// ============================================

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'x' + Math.abs(hash).toString(16);
}

function getBatchFromId(studentId) {
    const id = String(studentId).trim();
    const match1 = id.match(/^\d{2}(\d{2})[a-zA-Z]/i);
    if (match1) return match1[1];
    const match2 = id.match(/^(\d{3})/);
    if (match2) {
        const prefix = match2[1];
        const batchMap = {'015': '61', '016': '62', '017': '63'};
        return batchMap[prefix] || prefix;
    }
    return '00';
}

function to12h(t) {
    const p = t.split(':'), h = parseInt(p[0]), m = p[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return h12 + ':' + m + ' ' + ampm;
}

function formatTime(t) {
    const p = t.split('-');
    return to12h(p[0]) + ' - ' + to12h(p[1] || p[0]);
}

function timeToMinutes(t) {
    const p = t.split('-')[0].trim().split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
}

function mergeConsecutive(routines) {
    if (!routines.length) return [];
    routines.sort((a, b) => a.startMin - b.startMin);
    const merged = [];
    let prev = null;
    for (const r of routines) {
        if (prev && prev.course === r.course && prev.batch === r.batch && 
            prev.room === r.room && prev.teacher === r.teacher && 
            r.startMin === prev.startMin + 60) {
            const pp = prev.time.split('-'), rp = r.time.split('-');
            prev.time = pp[0].trim() + ' - ' + rp[1].trim();
        } else {
            if (prev) merged.push(prev);
            prev = {...r};
        }
    }
    if (prev) merged.push(prev);
    return merged;
}

function parseCSV(csv) {
    const lines = csv.split('\n'), routines = [];
    const dayMap = {sat:'Saturday', sun:'Sunday', mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday'};
    const timeSlots = [];
    let currentDay = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cells = [];
        let c = '', q = false;
        for (let j = 0; j < line.length; j++) {
            if (line[j] === '"') q = !q;
            else if (line[j] === ',' && !q) { cells.push(c.trim()); c = ''; }
            else c += line[j];
        }
        cells.push(c.trim());
        
        const first = cells[0].toLowerCase().trim();
        if (first === 'abbreviation') break;
        if (first.startsWith('..........') || first.includes('jannatul')) break;
        
        if (cells[0] === 'Day' && cells[1] === 'Room') {
            for (let k = 2; k < cells.length; k++) {
                if (cells[k] && cells[k].includes(':')) timeSlots.push(cells[k]);
            }
            continue;
        }
        
        if (first.includes('manarat') || first.includes('class routine') || first.includes('updated on')) continue;
        if (dayMap[first]) { currentDay = dayMap[first]; }
        
        if (currentDay && cells.length >= 3 && cells[1] && timeSlots.length > 0) {
            const room = cells[1];
            for (let j = 2; j < cells.length && j - 2 < timeSlots.length; j++) {
                const data = cells[j] ? cells[j].trim() : '';
                if (!data) continue;
                
                let clean = data.replace(/^\(/, '').replace(/\)$/, '').replace(/\)\s+([A-Z])/g, ')/$1');
                const parts = clean.split('/');
                if (parts.length < 2) continue;
                
                let batchPart = parts[0].trim(), course = '', teacher = '';
                if (parts.length === 2) course = parts[1].trim();
                else if (parts.length === 3) { course = parts[1].trim(); teacher = parts[2].trim(); }
                else if (parts.length === 4) { course = parts[1] + '/' + parts[2]; teacher = parts[3].trim(); }
                if (!course) continue;
                
                const tokens = batchPart.split('+').map(t => t.trim()).filter(Boolean);
                for (const token of tokens) {
                    const match = token.match(/^(\d+)(\([FM]\))?/);
                    if (match) {
                        routines.push({
                            day: currentDay,
                            time: timeSlots[j - 2],
                            startMin: timeToMinutes(timeSlots[j - 2]),
                            batch: match[1],
                            batchDisplay: match[1] + (match[2] || ''),
                            course, room, teacher
                        });
                    }
                }
            }
        }
    }
    return routines;
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { simpleHash, getBatchFromId, to12h, formatTime, timeToMinutes, mergeConsecutive, parseCSV };
}
