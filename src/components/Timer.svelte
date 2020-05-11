<script>
  import { _ } from 'svelte-i18n';
  import {
    counter,
    timerFormattedTime,
    timerTime,
    comment,
  } from './../store/counter.js';
  import {
    extraCounter,
    extraCounterFormattedTime,
  } from './../store/extraCounter.js';
  import {
    intervals,
    intervalsArr,
    currentInterval,
    initIntervals,
  } from './../store/intervals.js';
  import { stat } from './../store/statistics.js';
  import { settings } from './../store/settings.js';
  import { makeTwoDigitsCifer, getRandomColor } from './../utils.js';
  import { initTags } from './../store/tags.js';
  import Tags from './Tags.svelte';
  import Statistics from './Statistics.svelte';
  import ExpandBlock from './ExpandBlock.svelte';
  import DefaultButton from './DefaultButton.svelte';
  import BasicModal from './BasicModal.svelte';
  import Comment from './Comment.svelte';

  const faviconEl = document.querySelector('link[rel="icon"]');
  const faviconHref = faviconEl.getAttribute('href');
  let faviconTimer;

  let isMute = false;
  let isCommentActive = false;
  let intervalDuration;

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

  function switchMuting() {
    isMute = !isMute;
    counter[isMute ? 'mute' : 'unmute']();
  }

  function finishPeriod() {
    counter.finishPeriod($currentInterval);
  }

  function addTime(isNewBreak = false) {
    stat.addTime($extraCounter, isNewBreak);
    extraCounter.reset();
  }
</script>

<div class="timer">
  <div class="inner">
    <div class="cifers">
      {$timerFormattedTime.mins}
      <span class="cifers-divider">:</span>
      {$timerFormattedTime.secs}
    </div>
    <div class="extra-counter-wrapper">
      {#if $extraCounter}
        {#if $extraCounter > 30}
          {#if $currentInterval === 'main'}
            {$_('add_time')}
            <div class="extra-counter-buttons">
              <button
                class="button control extra-counter-button"
                on:click="{() => {
                  addTime();
                }}"
              >
                {$_('last_period')}
              </button>
              <button
                class="button control extra-counter-button"
                on:click="{() => {
                  addTime(true);
                }}"
              >
                {$_('new_break')}
              </button>
            </div>
          {:else}
            <button
              class="button control extra-counter-button"
              on:click="{() => {
                addTime();
              }}"
            >
              {$_('add_time')} {$_('last_period')}
            </button>
          {/if}
        {/if}
        <div class="extra-counter">
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
        on:click="{switchMuting}"
        class:unactive="{$extraCounter}"
      >
        {$_(isMute ? 'unmute' : 'mute')}
      </button>
    </div>
    <div class="buttons">
      {#each $intervalsArr as interval}
        <div class="button-wrapper">
          <button
            class="button"
            class:active="{interval[0] === $currentInterval}"
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
  }
  .cifers-divider {
    position: relative;
    top: -6px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
  }
  .controls {
    display: flex;
    justify-content: center;
  }
  .button-wrapper {
    position: relative;
    &:hover {
      .edit {
        display: block;
      }
    }
  }
  .edit {
    position: absolute;
    left: 50%;
    top: -15px;
    z-index: 5;
    cursor: pointer;
    display: none;
  }
  .button {
    padding: 10px 10px;
    background-color: transparent;
    color: #bbb;
    opacity: 0.5;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s opacity;
    text-align: center;
    font-size: 22px;
    &.control {
      color: #444;
      font-size: 12px;
      width: 100px;
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
  }
  .extra-counter-buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .extra-counter-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    height: 40px;
  }
  .extra-counter {
    width: 55px;
    text-align: center;
    margin-left: 15px;
    font-size: 16px;
  }
</style>
