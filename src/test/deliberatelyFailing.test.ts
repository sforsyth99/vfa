// Throwaway: proves a failing test blocks merging (STORY-18). Never merge.
describe('branch protection proof', () => {
  it('fails on purpose', () => {
    expect(1 + 1).toBe(3);
  });
});
