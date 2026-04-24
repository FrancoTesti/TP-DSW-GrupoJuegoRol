let n = 5;

for (let i = 0; i < n; i++) {
    let spaces = Math.abs(Math.floor(n / 2) - i);
    let stars = 1 + 2 * (Math.floor(n / 2) - spaces);

    console.log(" ".repeat(spaces) + "*".repeat(stars) + " ".repeat(spaces));
}