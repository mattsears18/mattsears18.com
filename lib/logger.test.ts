import { captureException } from '@sentry/nextjs';
import { describe, expect, it, vi } from 'vitest';

// Mock Sentry so `reportError` can be asserted without a live DSN — mirrors the
// posts/work content-reader tests. `vi.mock` is hoisted above the import.
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));
const captureMock = vi.mocked(captureException);

import { logger, reportError } from './logger';

describe('logger', () => {
  it('exports a pino-style leveled logger with the standard level methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
});

describe('reportError', () => {
  it('routes a caught error through the structured logger AND Sentry, with shared context', () => {
    captureMock.mockClear();
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    const err = new Error('boom');
    reportError(err, { op: 'readPost', slug: 'broken' });

    // Structured logger gets the context fields plus the error object.
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toMatchObject({
      op: 'readPost',
      slug: 'broken',
      err,
    });

    // Sentry still receives the same context as tags — the #153 breadcrumb
    // behavior is preserved, not replaced.
    expect(captureMock).toHaveBeenCalledTimes(1);
    expect(captureMock.mock.calls[0][0]).toBe(err);
    expect(captureMock.mock.calls[0][1]).toMatchObject({
      tags: { op: 'readPost', slug: 'broken' },
    });

    errorSpy.mockRestore();
  });

  it('defaults context to an empty object when omitted', () => {
    captureMock.mockClear();
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    reportError(new Error('no context'));

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(captureMock).toHaveBeenCalledTimes(1);
    expect(captureMock.mock.calls[0][1]).toMatchObject({ tags: {} });

    errorSpy.mockRestore();
  });
});
