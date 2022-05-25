<script>
  import { _ } from 'svelte-i18n';
  import { intervalsArr } from './../../store/intervals.js';
  import { createEventDispatcher } from 'svelte';
  import BasicModal from './BasicModal.svelte';
  import TextInput from './../form-elements/TextInput.svelte';
  import DefaultSelect from './../form-elements/DefaultSelect.svelte';
  import DefaultButton from './../form-elements/DefaultButton.svelte';
  import { activities, activityOptionsForSelect } from '../../store/activities.js';
  import { stat, dayRanges } from '../../store/statistics.js';
  import {
    isRangeIntersectRanges,
    getDateStampByDayTitleAndTime,
    getHoursAndMinutesFromMinutes,
    getHoursAndMinutesFromDateStamp,
  } from '../../utils.js';

  const dispatch = createEventDispatcher();
  export let dayTitle = null;
  export let active = false;
  export let isAdding = false;
  export let editingRecord = null;
  export let recordIndex = null;

  let errorMessage = '';
  let recordTemplate = {
    intervalId: 'main',
    startTime: '',
    endTime: '',
    activityId: '',
    activityTitle: '',
    duration: '',
    comment: '',
  };
  let record = {...recordTemplate};

  $: isAdding && active && prefillForAdding();
  $: convertRecordForEditing(editingRecord);
  $: calculatedDuration = dayTitle && record.startTime && record.endTime
    ? record.endTime >= record.startTime
      ? getHoursAndMinutesFromMinutes(Math.ceil((endTimeStamp - startTimeStamp) / (1000 * 60)))
      : $_('not_correct')
    : '';
  $: intervalOptions = $intervalsArr.map(item => ({ value: item[0], text: $_('interval_labels.' + item[0]) }));
  $: startTimeStamp = dayTitle &&
    record.startTime[2] !== '.' &&
    getDateStampByDayTitleAndTime(dayTitle, record.startTime);
  $: endTimeStamp = dayTitle &&
    record.startTime[2] !== '.' &&
    getDateStampByDayTitleAndTime(dayTitle, record.endTime);
  $: activitiesOptions = isAdding
    ? $activityOptionsForSelect
    : [
    ...$activityOptionsForSelect,
    ...$activities[record?.activityId]
      ? []
      : [{ value: record?.activityId, text: record?.activityTitle + ` (${$_('removed')})` }]
  ];

  $: ranges = dayTitle && $dayRanges(dayTitle, isAdding ? null : editingRecord.startedAt);


  function convertRecordForEditing() {
    if (editingRecord) {
      const copiedRecord = JSON.parse(JSON.stringify(editingRecord));

      record = {
        intervalId: copiedRecord.intervalId,
        activityId: copiedRecord.activityId,
        activityTitle: copiedRecord.activityTitle,
        comment: copiedRecord.comment,
        startTime: getHoursAndMinutesFromDateStamp(copiedRecord.startedAt),
        endTime: getHoursAndMinutesFromDateStamp(copiedRecord.finishedAt),
      };
    } else {
      resetRecord();
    }
  }

  function prefillForAdding() {
    const activitiesKeys = Object.keys($activities);

    if (activitiesKeys.length === 1) {
      record.activityId = activitiesKeys[0];
    }
  }

  function resetRecord() {
    record = {...recordTemplate};
  }

  function getRecordForSaving() {
    return {
      intervalId: record.intervalId,
      activityId: record.activityId,
      activityTitle: $activities[record.activityId] || record.activityTitle,
      comment: record.comment,
      duration: Math.ceil((endTimeStamp - startTimeStamp) / (1000 * 60)),
      startedAt: startTimeStamp,
      finishedAt: endTimeStamp,
    };
  }

  function validate() {
    if (startTimeStamp > endTimeStamp) {
      errorMessage = $_('validation.duration_negative_error');

      return false;
    }

    if (endTimeStamp > +new Date()) {
      errorMessage = $_('validation.duration_more_than_current');

      return false;
    }

    if (isRangeIntersectRanges([startTimeStamp, endTimeStamp], ranges)) {
      errorMessage = $_('validation.intersect_error');

      return false;
    }

    return true;
  }

  function addRecord(event) {
    event.preventDefault();

    errorMessage = '';

    if (validate()) {
      stat.addRecordManually(dayTitle, getRecordForSaving());

      close();
    }
  }

  function editRecord(event) {
    event.preventDefault();

    errorMessage = '';

    if (validate()) {
      stat.changeRecord(dayTitle, recordIndex, getRecordForSaving());

      close();
    };
  }

  async function removeRecord() {
    const day = dayTitle;
    const startedAt = editingRecord.startedAt;
    
    setTimeout(() => {
      stat.removeStat(day, startedAt);
    }, 500);

    close();
  }

  function close() {
    dispatch('close');
  }
</script>
<BasicModal
  active="{active}"
  on:close="{close}"
  title={$_(isAdding ? 'add_record' : 'modals.edit_record')}
>
  <form
    on:submit="{ isAdding ? addRecord : editRecord }"
    class="handle-record-modal"
  >
    <h3 class="day">{$_('day').toLowerCase()}: {dayTitle}</h3>
    <section class="section">
      <DefaultSelect
        wide
        required
        label="{$_('activity')}"
        options={activitiesOptions}
        bind:value="{record.activityId}"
      />
      {#if !isAdding && !$activities[record.activityId]}
        <div class="validation-message">
          {$_('validation.deprecated_activity')}
        </div>
      {/if}
    </section>
    <section class="section">
      <DefaultSelect
        wide
        required
        label="{$_('type')}"
        options="{intervalOptions}"
        bind:value={record.intervalId}
      />
    </section>
    <section class="section time">
      <div class="time-block">
        <TextInput
          wide
          required
          type="time"
          bind:value="{record.startTime}"
          label="{$_('start_time')}"
        />
      </div>
      <div class="time-block">
        <TextInput
          wide
          required
          type="time"
          bind:value="{record.endTime}"
          label="{$_('end_time')}"
        />
      </div>
    </section>
    <section class="section">
      <TextInput
        wide
        readonly
        central
        pure
        value="{calculatedDuration}"
        label="{$_('duration')}"
      />
    </section>
    <section class="section">
      <TextInput
        wide
        bind:value="{record.comment}"
        label="{$_('comment')}"
      />
    </section>
    {#if errorMessage}
      <div class="validation-message">
        {errorMessage}
      </div>
    {/if}
    <footer class="footer">
      {#if isAdding}
        <DefaultButton
          on:click="{close}"
          small
        >
          {$_('cancel').toLowerCase()}
        </DefaultButton>
      {:else}
        <DefaultButton
          on:click="{removeRecord}"
          small
        >
          {$_('modals.delete_record').toLowerCase()}
        </DefaultButton>
      {/if}
      <DefaultButton
        type="submit"
        bordered
      >
        {$_('save')}
      </DefaultButton>
    </footer>
  </form>
</BasicModal>

<style lang="scss">
  .handle-record-modal {
    width: 300px;
    margin: 0 auto;
    padding: 50px 15px;
    color: var(--color-text-softer);
    .day {
      text-align: left;
      color: var(--color-text-soft);
      font-size: 14px;
    }
    .section {
      margin-bottom: 20px;
      &.time {
        display: flex;
        gap: 15px;
        justify-content: space-between;
      }
    }
    .time-block {
      flex-grow: 1;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 10px 0;
    }
    .validation-message {
      font-size: 12px;
      color: var(--color-text-softest);
      margin-bottom: 15px;
    }
  }
</style>