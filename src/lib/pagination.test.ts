import { describe, expect, it } from 'vitest';

import { clampPage, pageWindow } from './pagination';

describe('pageWindow', () => {
  it('lists every page while they still fit', () => {
    expect(pageWindow(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('handles a single page', () => {
    expect(pageWindow(1, 1)).toEqual([1]);
  });

  it('gaps between the ends and the current page', () => {
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
  });

  it('opens no gap where the neighbours already touch an end', () => {
    expect(pageWindow(2, 10)).toEqual([1, 2, 3, null, 10]);
    expect(pageWindow(9, 10)).toEqual([1, null, 8, 9, 10]);
  });

  it('never repeats a page number', () => {
    for (let page = 1; page <= 12; page += 1) {
      const shown = pageWindow(page, 12).filter((n): n is number => n !== null);
      expect(new Set(shown).size).toBe(shown.length);
    }
  });
});

describe('clampPage', () => {
  it('defaults to the first page', () => {
    expect(clampPage(null, 5)).toBe(1);
  });

  it('keeps a real page', () => {
    expect(clampPage('3', 5)).toBe(3);
  });

  it('clamps past either end rather than rendering nothing', () => {
    expect(clampPage('99', 5)).toBe(5);
    expect(clampPage('0', 5)).toBe(1);
    expect(clampPage('-2', 5)).toBe(1);
  });

  it('treats an unreadable page as the first', () => {
    expect(clampPage('two', 5)).toBe(1);
  });
});
