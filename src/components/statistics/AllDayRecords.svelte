<script>
  import { _ } from 'svelte-i18n';
  import { stat } from './../../store/statistics.js';
  import { makeAbsoluteTimeString } from './../../utils.js';
  import { settings } from './../../store/settings.js';

  export let dayStat = [];
  export let date = '';

</script>

<div class="all-day-records">
  {#each dayStat as record}
    <div
      class="record"
      class:activity="{record.intervalId === 'main'}"
    >
      <div class="record-main">
        <div class="tag">
          {record.tag.title} ({record.duration} {$_('min')}{
            $settings.showPlannedDuration
              && record.plannedDuration !== record.duration
                ? `, ${record.plannedDuration} ${$_('planned')}` 
                : ''})
          {record.intervalId !== 'main' ? $_('interval_labels.' + record.intervalId) : ''}
        </div>
        <div class="time">
          {#if record.startedAt}
            <div>
              {$_('started_at')}
              <span>
                {makeAbsoluteTimeString(record.startedAt, true)}
              </span>
            </div>
          {/if}
          {#if record.finishedAt}
            <div>
              {$_('finished_at')}
              <span>
                {makeAbsoluteTimeString(record.finishedAt, true)}
              </span>
            </div>
          {/if}
        </div>
      </div>
      <div
        class="record-remove"
        on:click="{() => {
          stat.removeStat(date, record.finishedAt);
        }}"
      ></div>
      {#if record.comment}
        <div class="record-comment">{$_('comment')}: {record.comment}</div>
      {/if}
    </div>
  {/each}
</div>


<style lang="scss">
.all-day-records {
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
}
</style>