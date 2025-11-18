# 🔐 Vault Break CTF Challenge - Solution

## Quick Introduction

This repository contains my solution for the CTF VaultBreak by SOLCTF.
If you want to run this in docker just reopen the repository via devcontainer in VSCode.
For running my solution simply set up a local sonala validator and run
 ```npx tsx build_txs.ts ```
Below you find the original README.
If you have anything to add to my solution feel free to open a issue or contact me directly via X: @0x6vb

## 📖 The Story

Welcome to VaultCo™, where the motto is “move fast and break… vaults?” The team shipped a shiny new Solana vault with enterprise-grade seriousness: a big red OPEN button guarded by a Responsible Adult™ called “the admin.”

Unfortunately, the intern also shipped a convenient RESET ADMIN lever right next to it. For “onboarding.” For everyone.

Rumor has it the vault is still locked, the admin left for coffee, and the lever has no safety cover. Time to be a… responsible auditor. With flair.

---

## 🎯 Challenge Details

- **Goal**: Make the vault open and capture the flag.
- **What to submit**: Exactly two base64-encoded Solana transactions that, when executed in order, result in the vault being opened.
  - Transaction 1: does something that makes Transaction 2 viable.
  - Transaction 2: finishes the job. Confetti happens. Probably.
- **Order matters**: These two transactions must be executed sequentially in the order you intend.
- **What you’re given**: Only the program ID and the IDL. Everything else is on you.

### Program ID

```
uWGrWGNk4enkjkboj6ErEW8FKDQBaFCUGqtpcw7Ea5m
```

### IDL

- 📄 Use this to understand the interface, accounts, and discriminators:
  - `./idl.json`

We verify your submission by decoding both base64 blobs as `VersionedTransaction`s, running them in a local Solana VM, and checking that the vault indeed opens. No spoilers—if your pair of transactions really “gets it,” the vault will celebrate accordingly.

---

## 📦 What You Need To Figure Out (from the IDL)

- Which instruction lets Responsible Adults open the vault.
- Which other instruction probably shouldn't have shipped without a giant lock icon.
- What accounts those instructions require and who must sign.
- The PDA seeds used for the vault (hint: it’s a minimalist diet).
- The discriminators that help you identify the instructions in transaction data.

If those dots connect in your head, you’re already halfway through the door.

---

## 🧾 Submission Format

Submit JSON with two fields (in any surrounding schema your platform uses):

- base64-encoded `VersionedTransaction`
- base64-encoded `VersionedTransaction`

Constraints:

- Both must be valid `VersionedTransaction`s.
- Executed in sequence, they must result in the vault being opened.

That’s it. No builder tutorial, no hand-holding. You’re the safecracker.

---

## 💬 Tiny Hints (optional reading)

- The IDL is your treasure map. The discriminators are the breadcrumbs.
- If an instruction sounds like it changes “who is allowed to do things,” it probably does exactly that.
- If the vault refuses to open, ask yourself: “Would a different signature help?”
- The vault PDA uses a very… modest seed strategy.

---

## 📚 Useful References

- [Anchor IDL Reference](https://www.anchor-lang.com/docs/idl)
- [Solana Program Library](https://spl.solana.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Security Best Practices](https://github.com/coral-xyz/sealevel-attacks)

---

Good luck, safecracker. Try not to spill coffee on the lever. 🧰☕
