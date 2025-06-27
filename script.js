console.log(Math.floor(Math.random() * 100));
var isPalindrome = function (s) {
    s = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    console.log(s);
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
};
let s = "A man, a plan, a canal: Panama";
console.log(isPalindrome(s));
// var generate = function (numRows) {
//     const res = [[1]];
//     for (let i = 0; i < numRows - 1; i++) {
//         const dummyRow = [0, ...res[res.length - 1], 0];
//         const row = [];
//         for (let r = 0; r < dummyRow.length - 1; r++) {
//             row.push(dummyRow[r] + dummyRow[r + 1]);
//         }
//         res.push(row);
//     }
//     return res;
//     // const res = [[1]];

//     // for (let i = 0; i < numRows - 1; i++) {
//     //     const dummyRow = [0, ...res[res.length - 1], 0];
//     //     const row = [];

//     //     for (let j = 0; j < dummyRow.length - 1; j++) {
//     //         row.push(dummyRow[j] + dummyRow[j + 1]);
//     //     }

//     //     res.push(row);
//     // }

//     // return res;
// };
// var longestCommonPrefix = function (strs) {
//     let res = '';
//     for (let i = 0; i < strs[0].length; i++) {
//         if (strs) {

//         }
//     }
//     return res;
// };
// let strs = ["flower", "flow", "flight"];
// // console.log(Math.max([...strs]));
// console.log(longestCommonPrefix(strs))       