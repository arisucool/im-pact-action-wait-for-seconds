import { expect } from '@jest/globals';
import { ActionTestHelper } from '@arisucool/im-pact-core';

import ActionWaitForSeconds from './index';

const OWN_ACTION_INDEX = 0;

describe('Initialization', () => {
  it('Basic', () => {
    ActionTestHelper.initModule('ActionWaitForSeconds', {}, ActionWaitForSeconds);
  });
});

describe('execAction', () => {
  it('Allow', async () => {
    const mod: ActionWaitForSeconds = ActionTestHelper.initModule(
      'ActionWaitForSeconds',
      {
        waitSeconds: 60,
      },
      ActionWaitForSeconds,
    );

    const tweet = ActionTestHelper.getTweet();
    tweet.lastActionIndex = OWN_ACTION_INDEX;

    const lastActionExecutedAt = new Date();
    lastActionExecutedAt.setSeconds(-120);
    tweet.lastActionExecutedAt = lastActionExecutedAt;

    expect(await mod.execAction(tweet)).toBe(true);
  });

  it('Deny because specified time has not passed', async () => {
    const mod: ActionWaitForSeconds = ActionTestHelper.initModule(
      'WaitForSecondsAction',
      {
        waitSeconds: 300,
      },
      ActionWaitForSeconds,
    );

    const tweet = ActionTestHelper.getTweet();
    tweet.lastActionIndex = OWN_ACTION_INDEX;

    const lastActionExecutedAt = new Date();
    lastActionExecutedAt.setSeconds(-120);
    tweet.lastActionExecutedAt = lastActionExecutedAt;

    expect(await mod.execAction(tweet)).toBe(false);
  });

  it('Deny because this item is first appearance... see you next time', async () => {
    const mod: ActionWaitForSeconds = ActionTestHelper.initModule(
      'WaitForSecondsAction',
      {
        waitSeconds: 300,
      },
      ActionWaitForSeconds,
    );

    const tweet = ActionTestHelper.getTweet();
    tweet.lastActionIndex = -1; // This item was not processed yet by any actions

    const lastActionExecutedAt = new Date();
    lastActionExecutedAt.setSeconds(-120);
    tweet.lastActionExecutedAt = lastActionExecutedAt;

    expect(await mod.execAction(tweet)).toBe(false);
  });

  it('Throw error because setting is empty', async () => {
    const mod: ActionWaitForSeconds = ActionTestHelper.initModule('WaitForSecondsAction', {}, ActionWaitForSeconds);

    const tweet = ActionTestHelper.getTweet();
    tweet.lastActionIndex = 0;

    await expect(mod.execAction(tweet)).rejects.toThrow();
  });
});
