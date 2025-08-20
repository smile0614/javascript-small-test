function serialize(nums) {
  nums = Array.from(new Set(nums)).sort((a, b) => a - b); // множество
  const bitArray = new Uint8Array(Math.ceil(300 / 8));

  for (let n of nums) {
    if (n < 1 || n > 300) throw new Error("Out of range");
    const idx = n - 1;
    bitArray[Math.floor(idx / 8)] |= (1 << (idx % 8));
  }

  // бинарные данные → Base64
  let binary = String.fromCharCode(...bitArray);
  let base64 = Buffer.from(binary, "binary").toString("base64");

  // обычная сериализация
  let plain = nums.join(",");

  // выбираем компактнейший вариант
  if (base64.length * 2 < plain.length) {
    return base64;
  } else {
    return ":" + plain; // ":" = префикс "без сжатия"
  }
}

function deserialize(str) {
  if (str.startsWith(":")) {
    return str.slice(1).split(",").map(Number);
  }

  // base64 → бинарь
  let buf = Buffer.from(str, "base64");
  let result = [];
  for (let i = 0; i < 300; i++) {
    let byte = buf[Math.floor(i / 8)];
    if (byte & (1 << (i % 8))) {
      result.push(i + 1);
    }
  }
  return result;
}