# ✨ FuncGenie – Auto-Generate C++ Function Definitions from Calls

> ⚡ Powered by Gopal Tatva  
> 🚀 Make C++ coding magical by eliminating boilerplate!

---

## 🌟 Overview

FuncGenie is a lightweight **VS Code extension** that automatically generates C++ function definitions from function calls in real-time — so you can stay focused on logic, not syntax.

You write this:

```cpp
int res = greet("RandomText", 108);
```

✨ FuncGenie generates:

```cpp
int greet(string arg0, int arg1) {
    // TODO: implement greet()
}
```

---

## 🛠️ Features

- 🧠 **Smart Type Inference** – from literals and declared variables
- 🚫 **No Duplicate Generation** – intelligently avoids repeated stubs
- 🔁 **Automatic Updates** – renaming the function updates its definition
- 🪄 **Inserts Above `main()`** – keeps code structure clean and clear
- 📦 Works with macros, `signed main`, and C++ tricks

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tanishqaswar/FuncGenie.git
cd FuncGenie
npm install
```

### 2. Compile the Extension

```bash
npm run compile
```

### 3. Launch Extension in Dev Mode

```bash
code .
```

Then press **F5** in VS Code to open the Extension Development Host.

---

## ✍️ Usage

1. Open a `.cpp` file
2. Type a function call like:

   ```cpp
   int val = sum(3, 5);
   ```

3. 🪄 *FuncGenie automatically adds:*

   ```cpp
   int sum(int arg0, int arg1) {
       // TODO: implement sum()
   }
   ```

   ✨ Right above your `main()` function!

---

## 🛤️ Roadmap

Coming Soon by Krishna's Mercy:

- 🧩 Support for `vector`, `pair`, `map`, and nested containers
- 🧬 Deep Type Deduction for complex data types
- 📝 Smarter param names (`age`, `name`, `arr`) instead of `arg0`
- 🔄 Live Refactor Support – sync changes between call and definition
- 🌐 Multi-language support (Golang, Python, Rust)

---

## 🙏 Made By

FuncGenie is built by  
**[Tanishq Aswar](https://github.com/tanishqaswar)**  
🎓 IIIT Lucknow • C++ Automation Enthusiast

---

## 🪪 License

Licensed under the **MIT License** – free to use, modify, and distribute.

---

## 💬 Feedback & Contributions

🛠️ Open issues, suggest ideas, or submit PRs — let's build the coder's devotional assistant together!

---

🕉️ *"Chant Hare Krishna and code functionally."*
