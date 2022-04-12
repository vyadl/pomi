<script>
  import { _ } from 'svelte-i18n';
  import {
    stat,
    statArr,
    initStat,
    statTotal,
    makeHoursAndMinutes,
  } from './../store/statistics.js';
  import { makeAbsoluteTimeString } from './../utils.js';
  import { settings } from './../store/settings.js';
  import { activityFactor } from './../store/intervals.js';
  import ExpandBlock from './ExpandBlock.svelte';
  
  initStat();
</script>

<div class="stat">
  {#each $statArr as dayStat}
    {#if dayStat.data.length}
      <div class="day">
        <ExpandBlock title="{dayStat.name}" center>
        <div class="main-data">
          {#if $statTotal[dayStat.name] && $statTotal[dayStat.name].all}
            <div class="total">
              <div class="total-title">{$_('total')}</div>
              <div class="total-subtitle">{$_('sum')}:</div>
              {#if $statTotal[dayStat.name].sum.activities}
                <div class="total-record activities">
                  <div>{$_('activities').toLowerCase()}</div>
                  <div class="activity-sum">
                    <div>
                      {makeHoursAndMinutes($statTotal[dayStat.name].sum.activities * $activityFactor)}
                    </div>
                    <div class={$activityFactor ? 'pure' : ''}>
                      {#if $activityFactor}
                        {$_('pure_time')} -
                      {/if}
                      {makeHoursAndMinutes($statTotal[dayStat.name].sum.activities)}
                    </div>
                  </div>
                </div>
              {/if}
              {#if $statTotal[dayStat.name].sum.breaks}
                <div class="total-record">
                  <div>{$_('breaks').toLowerCase()}</div>
                  <div>
                    {makeHoursAndMinutes($statTotal[dayStat.name].sum.breaks)}
                  </div>
                </div>
              {/if}
              <br />
              {#if Object.keys($statTotal[dayStat.name].global).length}
                <div class="total-subtitle">{$_('global_activities')}:</div>
                {#each Object.keys($statTotal[dayStat.name].global) as tagKey, i}
                  <div class="total-record">
                    <div>{`${tagKey}`}</div>
                    <div>
                      {$statTotal[dayStat.name].global[tagKey].quantity} ({makeHoursAndMinutes($statTotal[dayStat.name].global[tagKey].totalTime)})
                    </div>
                  </div>
                {/each}
                <br />
                <div class="total-subtitle">{$_('all_activities')}:</div>
              {/if}
              {#each Object.keys($statTotal[dayStat.name].all) as tagKey, i}
                <div class="total-record">
                  <div>{`${tagKey}`}</div>
                  <div>
                    {$statTotal[dayStat.name].all[tagKey].quantity} ({makeHoursAndMinutes($statTotal[dayStat.name].all[tagKey].totalTime)})
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
                    stat.removeStat(dayStat.name, data.finishedAt);
                  }}"
                ></div>
                {#if data.comment}
                  <div class="record-comment">{$_('comment')}: {data.comment}</div>
                {/if}
              </div>
            {/each}
          </ExpandBlock>
        </div>
        </ExpandBlock>
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
  .activities {
    font-size: 16px;
    padding: 25px 0;
  }
  .activity-sum {
    text-align: right;
  }
  .pure {
    font-size: 12px;
    color: #555;
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
    &.activities {
      font-size: 17px;
      color: #aaa;
      padding: 25px 0 45px;
    }
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
