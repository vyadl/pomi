<script>
  import { _ } from 'svelte-i18n';
  import {
    counter,
    timerFormattedTime,
    timerTime,
  } from './../store/counter.js';
  import {
    extraCounter,
    extraCounterFormattedTime,
    timerTime as extraTimerTime,
  } from './../store/extraCounter.js';
  import {
    intervalsArr,
    currentInterval,
    initIntervals,
  } from './../store/intervals.js';
  import { stat, lastTime } from './../store/statistics.js';
  import { settings } from './../store/settings.js';
  import { makeTwoDigitsCifer, getRandomColor } from './../utils.js';
  import { initTags } from './../store/tags.js';
  import Tags from './Tags.svelte';
  import Statistics from './Statistics.svelte';
  import ExpandBlock from './ExpandBlock.svelte';
  import Comment from './Comment.svelte';
  import TotalStat from './TotalStat.svelte';

  const MIN_EXTRA_TIME_FOR_ADDING_IN_SECS = 30;

  const faviconEl = document.querySelector('link[rel="icon"]');
  const faviconHref = faviconEl.getAttribute('href');
  let faviconTimer;

  let isCommentActive = false;

  counter.set(0);
  initTags();
  initIntervals();
  initAnimateFavicon();
  

  function initAnimateFavicon() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let currentCifer = 0;

    canvas.height = canvas.width = 64;
    context.font = '42px Monaco, Courier, monospace';
    context.fillStyle = '#fff';

    faviconTimer = setInterval(() => {
      const currentCounter =
        $timerTime.mins > 0 ? $timerTime.mins : $timerTime.secs;

      if ((currentCifer !== currentCounter && $settings.showTimeInFavicon)
        || ($settings.showTimeInFavicon && faviconEl.getAttribute('href') === faviconHref)) {
        const bgcolor =
          $timerTime.mins < 1 && $timerTime.secs < 10 && $settings.showLastSecondsColorful
            ? getRandomColor()
            : '#000';

        currentCifer = currentCounter;

        context.clearRect(0, 0, 64, 64);
        context.fillStyle = bgcolor;
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = '#fff';
        context.fillText(makeTwoDigitsCifer(currentCifer), 8, 48, 48);    
        faviconEl.setAttribute('href', canvas.toDataURL('image/png'));
      }

      if (!currentCounter || !$settings.showTimeInFavicon) {
        faviconEl.setAttribute('href', faviconHref);
      }

      if (!currentCounter) {
        clearInterval(faviconTimer);
      }
    }, 1000);
  }

  function startPeriod(interval) {
    isCommentActive = false;
    clearInterval(faviconTimer);
    counter.set(interval[1].duration * 60);
    counter.start(interval[0]);
    currentInterval.set(interval[0]);
    initAnimateFavicon();
  }

  function finishPeriod() {
    counter.finishPeriod($currentInterval);
  }

  function resetPeriod() {
    counter.resetPeriod($currentInterval)
  }

  function addExtraTime() {
    stat.addTime($extraCounter);
    resetExtraTime();
  }
  function resetExtraTime() {
    extraCounter.finish();
    currentInterval.set('');
  }
</script>

<div class="timer">
  <div class="inner">
    <div
      class="cifers"
      class:summed="{$extraCounter}"
    >
      {#if $extraCounter}
        <div class="cifers-desc">
          {$_('last')} {$_($currentInterval)} + {$_('extra_time')}
        </div>
        {makeTwoDigitsCifer(+$lastTime.duration + $extraTimerTime.mins)}
        <span class="cifers-divider">:</span>
        {makeTwoDigitsCifer($timerTime.secs + $extraTimerTime.secs)}
      {:else}
        {$timerFormattedTime.mins }
        <span class="cifers-divider">:</span>
        {$timerFormattedTime.secs}
      {/if}
    </div>
    <div class="extra-counter-wrapper">
      {#if $extraCounter}
        {#if $extraCounter > MIN_EXTRA_TIME_FOR_ADDING_IN_SECS}
          <div class="extra-counter-buttons">
            <button
              class="button control extra-counter-button"
              on:click="{addExtraTime}"
            >
            {$_('add_time')}
            </button>
            <button
              class="button control extra-counter-button"
              on:click="{resetExtraTime}"
            >
              {$_('reset')}
            </button>
          </div>
        {/if}
        <div class="extra-counter">
          <div class="extra-counter-desc">
            {$_('extra_time')}
          </div>
          {$extraCounterFormattedTime.mins}:{$extraCounterFormattedTime.secs}
        </div>
      {/if}
    </div>
    <div class="controls">
      <button
        class="button control"
        class:unactive="{!$counter}"
        on:click="{finishPeriod}"
      >
        {$_('finish')}
      </button>
      <button
        class="button control"
        class:unactive="{!$counter}"
        on:click="{resetPeriod}"
      >
        {$_('reset')}
      </button>
    </div>
    <div class="buttons">
      {#each $intervalsArr as interval}
        <div class="button-wrapper">
          <button
            class="button"
            class:active="{interval[0] === $currentInterval}"
            class:blocked="{(interval[0] !== $currentInterval) && ($counter || $extraCounter)}"
            on:click="{() => {
              startPeriod(interval);
            }}"
          >
            {interval[1].duration}
          </button>
        </div>
      {/each}
    </div>
    <Comment
      active="{isCommentActive}"
      visible="{$currentInterval}"
      on:switch="{() => {
        isCommentActive = !isCommentActive;
      }}"
    />
    {#if $settings.showActivityNearTimer}
      <TotalStat />
    {/if}
    <ExpandBlock title="{$_('activities')}">
      <Tags />
    </ExpandBlock>
    <ExpandBlock title="{$_('history')}">
      <Statistics />
    </ExpandBlock>
  </div>
</div>

<style lang="scss">
  .timer {
    display: flex;
  }
  .inner {
    padding: 30px 10px 40px;
    margin: auto;
    width: 100%;
    max-width: 420px;
  }
  .cifers {
    color: #eee;
    font: 70px Monaco, 'Courier New', monospace;
    letter-spacing: 5px;
    display: flex;
    justify-content: center;
    transition: color 1s;
    &.summed {
      color: #222;
    }
  }
  .cifers-desc {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
    font-size: 14px;
    letter-spacing: 1px;
    color: #333;
  }
  .cifers-divider {
    position: relative;
    top: -6px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    min-height: 90px;
  }
  .controls {
    display: flex;
    justify-content: center;
  }
  .button-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 80px;
  }
  .button {
    padding: 10px 10px;
    background-color: transparent;
    color: #bbb;
    opacity: .7;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    font-size: 22px;
    letter-spacing: 1px;
    transition: opacity .1s, font-size .1s;
    &.control {
      color: #aaa;
      font-size: 16px;
      min-width: 100px;
      text-align: center;
    }
    &.extra-counter-button {
      margin-bottom: 0;
      white-space: nowrap;
      width: auto;
      padding: 2px 11px;
    }
    &.unactive {
      pointer-events: none;
      opacity: 0;
    }

    &:hover,
    &:active,
    &.active {
      opacity: 1;
      background-color: transparent;
    }
    &.blocked {
      pointer-events: none;
    }
    &.active {
      font-size: 30px;
    }
  }
  .extra-counter-buttons {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-right: 40px;
  }
  .extra-counter-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    padding-top: 15px;
    height: 50px;
  }
  .extra-counter {
    position: relative;
    text-align: center;
    font-size: 22px;
    color: #aaa;
  }
  .extra-counter-desc {
    position: absolute;
    top: -15px;
    width: 200%;
    right: 0;
    text-align: right;
    font-size: 12px;
    letter-spacing: 1px;
    margin-bottom: 5px;
    color: #333;
  }
</style>
