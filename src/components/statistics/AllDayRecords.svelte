<script>
  import { _ } from 'svelte-i18n';
  import { makeAbsoluteTimeString, getHoursAndMinutesFromMinutes } from './../../utils.js';
  import { settings } from './../../store/settings.js';
  import HandleRecordModal from './../modals/HandleRecordModal.svelte';
  import DefaultButton from './../form-elements/DefaultButton.svelte';

  export let dayStat = [];
  export let date = '';
  
  let currentRecord = null;
  let currentRecordIndex = null;
  let dayTitle = null;
  let isHandleRecordActive = false;
  let isAdding = false;
  
  function openEditModal(record, recordIndex) {
    currentRecord = JSON.parse(JSON.stringify(record));
    currentRecordIndex = recordIndex;
    dayTitle = date;
    isAdding = false;
    isHandleRecordActive = true;
  }

  function openAddModal() {
    dayTitle = date;
    isAdding = true;
    isHandleRecordActive = true;
  }

  function resetEditing() {
    isHandleRecordActive = false;
    currentRecordIndex = null;
    dayTitle = null;
    currentRecord = null;
  }
</script>

<div class="all-day-records">
  {#each dayStat as record, recordIndex}
    <div
      class="record"
      class:activity="{record.intervalId === 'main'}"
      on:click="{() => { openEditModal(record, recordIndex) }}"
      title="edit"
    >
      <div class="record-main">
        <div class="activity-part">
          {record.activityTitle} ({getHoursAndMinutesFromMinutes(record.duration)}{
            $settings.showPlannedDuration &&
            record.plannedDuration &&
            record.plannedDuration !== record.duration
                ? `, ${getHoursAndMinutesFromMinutes(record.plannedDuration)} ${$_('planned')}`
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
      {#if record.comment}
        <div class="record-comment">{$_('comment')}: {record.comment}</div>
      {/if}
    </div>
  {/each}
  <div class="add-record">
    <DefaultButton
      on:click="{ openAddModal }"
    >
      {$_('add_record')}
    </DefaultButton>
  </div>
  <HandleRecordModal
    bind:isAdding="{isAdding}"
    bind:active="{isHandleRecordActive}"
    bind:editingRecord="{currentRecord}"
    bind:recordIndex="{currentRecordIndex}"
    bind:dayTitle="{dayTitle}"
    on:close={resetEditing}
  />
</div>


<style lang="scss">
.all-day-records {
  .record {
    padding: 4px 0;
    transition: background-color .2s, transform .2s .03s;
    position: relative;
    font-size: 11px;
    cursor: pointer;
    border: 1px solid var(--color-main-bg-softest);
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: var(--color-main-bg-soft);
    &.activity {
      color: var(--color-text-softer);
    }
    &:hover {
      background-color: var(--color-main-bg-soft-2);
      transform: scale(1.02);
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

  .activity-part {
    width: 50%;
    margin-right: 15px;
  }

  .time {
    text-align: right;
  }

  .add-record {
    text-align: center;
    padding: 15px;
    font-size: 14px;
  }
}
</style>
