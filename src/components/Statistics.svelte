<script>
  import { _ } from 'svelte-i18n';
  import { stat, statArr, initStat, statTotal } from './../store/statistics.js';
  import { makeAbsoluteTimeString } from './../utils.js';
  import { settings } from './../store/settings.js';
  import DefaultButton from './DefaultButton.svelte';
  import TextInput from './TextInput.svelte';
  import TextModal from './TextModal.svelte';
  import ExpandBlock from './ExpandBlock.svelte';

  initStat();

  function makeHoursAndMinutes(allMinutes) {
    const hours = Math.floor(allMinutes / 60);
    const minutes = allMinutes % 60;

    return `${hours ? hours + (minutes ? ' hr, ' : '') : ''}${
      minutes ? minutes + ' min' : ''
    }`;
  }
</script>

<div class="stat">
  {#each $statArr as dayStat}
    {#if dayStat.data.length}
      <div class="day">
        <div class="date">{dayStat.key}</div>
        <div class="main-data">
          {#if $statTotal[dayStat.key] && $statTotal[dayStat.key].all}
            <div class="total">
              <div class="total-title">{$_('total')}</div>
              <div class="total-subtitle">{$_('sum')}:</div>
              {#if $statTotal[dayStat.key].sum.activities}
                <div class="total-record">
                  <div>{$_('activities').toLowerCase()}</div>
                  <div>
                    {makeHoursAndMinutes($statTotal[dayStat.key].sum.activities)}
                  </div>
                </div>
              {/if}
              {#if $statTotal[dayStat.key].sum.breaks}
                <div class="total-record">
                  <div>{$_('breaks').toLowerCase()}</div>
                  <div>
                    {makeHoursAndMinutes($statTotal[dayStat.key].sum.breaks)}
                  </div>
                </div>
              {/if}
              <br />
              {#if Object.keys($statTotal[dayStat.key].global).length}
                <div class="total-subtitle">{$_('global_activities')}:</div>
                {#each Object.keys($statTotal[dayStat.key].global) as tagKey, i}
                  <div class="total-record">
                    <div>{`${tagKey}`}</div>
                    <div>
                      {$statTotal[dayStat.key].global[tagKey].quantity} ({makeHoursAndMinutes($statTotal[dayStat.key].global[tagKey].totalTime)})
                    </div>
                  </div>
                {/each}
                <br />
                <div class="total-subtitle">{$_('all_activities')}:</div>
              {/if}
              {#each Object.keys($statTotal[dayStat.key].all) as tagKey, i}
                <div class="total-record">
                  <div>{`${tagKey}`}</div>
                  <div>
                    {$statTotal[dayStat.key].all[tagKey].quantity} ({makeHoursAndMinutes($statTotal[dayStat.key].all[tagKey].totalTime)})
                  </div>
                </div>
              {/each}
            </div>
          {/if}
          <ExpandBlock title="{$_('all_day_records')}" small center>
            {#each dayStat.data as data}
              <div class="record" class:activity="{data.intervalId === 'main'}">
                <div class="record-main">
                  <div class="tag">
                    {data.tag[0][1]} ({data.duration} {$_('min')}{
                      $settings.showPlannedDuration
                        && data.plannedDuration !== data.duration
                          ? `, ${data.plannedDuration} ${$_('planned')}` 
                          : ''})
                  </div>
                  <div class="time">
                    {#if data.startedAt}
                      <div>
                        {$_('started_at')}
                        <span>
                          {makeAbsoluteTimeString(data.startedAt, true)}
                        </span>
                      </div>
                    {/if}
                    {#if data.finishedAt}
                      <div>
                        {$_('finished_at')}
                        <span>
                          {makeAbsoluteTimeString(data.finishedAt, true)}
                        </span>
                      </div>
                    {/if}
                  </div>
                </div>
                <div
                  class="record-remove"
                  on:click="{() => {
                    stat.removeStat(dayStat.key, data.finishedAt);
                  }}"
                ></div>
                {#if data.comment}
                  <div class="record-comment">{$_('comment')}: {data.comment}</div>
                {/if}
              </div>
            {/each}
          </ExpandBlock>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .stat {
    padding: 10px 0;
  }
  .day {
    margin-bottom: 15px;
  }
  .record {
    padding: 4px 20px 4px 0;
    transition: background-color 0.2s;
    position: relative;
    font-size: 12px;
    &.activity {
      color: #555;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }
  .record-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .record-comment {
    padding-top: 5px;
  }
  .record-remove {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 17px;
    height: 17px;
    cursor: pointer;
    font-size: 12px;
    opacity: 0.8;
    transition: opacity 0.2s;
    &::before,
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      width: 9px;
      height: 1px;
      background-color: #bbb;
      transform: translateY(-50%) rotate(45deg);
    }
    &::after {
      transform: translateY(-50%) rotate(-45deg);
    }
    &:hover {
      opacity: 1;
    }
  }
  .tag {
    width: 50%;
    margin-right: 15px;
  }
  .time {
    text-align: right;
  }
  .date {
    color: #888;
    margin-bottom: 8px;
    font-size: 14px;
    text-align: center;
  }
  .total {
    padding-top: 10px;
    font-size: 12px;
    color: #666;
  }
  .total-record {
    display: flex;
    justify-content: space-between;
    transition: background-color 0.2s;
    padding: 2px 0;
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }
  .total-title {
    text-align: center;
  }
  .total-subtitle {
    font-size: 10px;
    color: #555;
  }
</style>
