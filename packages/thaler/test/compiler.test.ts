import * as babel from '@babel/core';
import { describe, expect, it } from 'vitest';
import plugin, { Options } from '../babel';

const options: Options = {
  origin: 'http://localhost:3000',
  prefix: 'example',
  source: 'example.tsx',
  mode: 'server',
};

async function compile(mode: 'server' | 'client', code: string) {
  const result = await babel.transformAsync(code, {
    plugins: [
      [plugin, { ...options, mode }],
    ],
    parserOpts: {
      plugins: [
        'jsx',
      ],
    },
  });

  return result?.code ?? '';
}

describe('server$', () => {
  it('should transform', async () => {
    const code = `
import { server$ } from 'thaler';

const example = server$((request) => {
  return new Response('Hello World', {
    headers: {
      'content-type': 'text/html',
    },
    status: 200,
  });
});
  `;
    expect(await compile('server', code)).toMatchSnapshot();
    expect(await compile('client', code)).toMatchSnapshot();
  });
});
describe('loader$', () => {
  it('should transform', async () => {
    const code = `
import { loader$ } from 'thaler';

const example = loader$((search) => {
  const message = search.get('greeting') + ', ' + search.get('receiver') + '!';
  return new Response(message, {
    headers: {
      'content-type': 'text/html',
    },
    status: 200,
  });
});
  `;
    expect(await compile('server', code)).toMatchSnapshot();
    expect(await compile('client', code)).toMatchSnapshot();
  });
});
describe('action$', () => {
  it('should transform', async () => {
    const code = `
import { action$ } from 'thaler';

const example = action$((form) => {
  const message = form.get('greeting') + ', ' + form.get('receiver') + '!';
  return new Response(message, {
    headers: {
      'content-type': 'text/html',
    },
    status: 200,
  });
});
  `;
    expect(await compile('server', code)).toMatchSnapshot();
    expect(await compile('client', code)).toMatchSnapshot();
  });
});
describe('function$', () => {
  it('should transform', async () => {
    const code = `
import { function$ } from 'thaler';

const PREFIX = 'Message: ';

const example = function$(({ greeting, receiver }) => {
  const message = PREFIX + greeting + ', ' + receiver + '!';
  return message;
});
  `;
    expect(await compile('server', code)).toMatchSnapshot();
    expect(await compile('client', code)).toMatchSnapshot();
  });
});
