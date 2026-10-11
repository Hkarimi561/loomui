# Questionnaire — manual test checklist
Playground: Components → Questionnaire. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Click Next without answering a required question.
  Expected: Error "This question is required."; stays on the question.
  Result:
- [ ] Choose a plan, Next, pick two interests, Next, type text, Submit.
  Expected: Result JSON `{plan, tags[], note}`.
  Result:
## Keyboard
- [ ] Press "2" on the first question.
  Expected: Second choice selected.
  Result:
- [ ] Press Enter.
  Expected: Advances (or errors if required & empty).
  Result:
## Screen reader
- [ ] Navigate with a screen reader.
  Expected: Progress read as "Question X of N"; hidden questions are skipped (hidden + inert).
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
