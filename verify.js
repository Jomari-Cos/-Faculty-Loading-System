const fs = require('fs');
const base = 'c:\\Users\\Lab Telecom\\Faculty-Loading-System';
const js = fs.readFileSync(base + '\\script.js', 'utf8');
const html = fs.readFileSync(base + '\\index.html', 'utf8');

console.log('JS mappingCourses ref declared:', js.includes('const mappingCourses'));
console.log('JS courses in submit object:', js.includes('        courses\n    };'));
console.log('JS editMapping populates courses:', js.includes('mappingCourses.value'));
console.log('JS import uses m.courses:', js.includes('m.courses'));
console.log('JS export header Courses:', js.includes("Courses Taught"));
console.log('HTML mappingCourses field:', html.includes('id="mappingCourses"'));
console.log('HTML Courses Taught th:', html.includes('Courses Taught'));
console.log('HTML colspan 7 (should be fixed to 8):', html.includes('colspan="7"'));
