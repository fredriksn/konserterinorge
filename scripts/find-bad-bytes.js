const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
const bad = [0xF8,0xE6,0xE5,0xD8,0xC6,0xC5,0x96,0x97,0x93,0x94,0x91,0x92];
let found = [];
for (let i = 0; i < buf.length; i++) {
  if (bad.includes(buf[i])) {
    const ctx = buf.slice(Math.max(0,i-30), i+30);
    const prev = buf[Math.max(0,i-1)];
    const next = buf[Math.min(buf.length-1,i+1)];
    found.push({ pos: i, byte: '0x'+buf[i].toString(16).padStart(2,'0'), prev: '0x'+prev.toString(16), next: '0x'+next.toString(16) });
  }
}
console.log('Total bad bytes:', found.length);
found.slice(0,15).forEach(f => {
  console.log(`pos ${f.pos}: ${f.byte} (prev=${f.prev}, next=${f.next})`);
});
