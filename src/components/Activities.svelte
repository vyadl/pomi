<script>
  import { _ } from 'svelte-i18n';
  import TextModal from './modals/TextModal.svelte';
  import CustomButton from './form-elements/CustomButton.svelte';
  import { settings } from './../store/settings';
  import {
    activitiesArr,
    currentActivityId,
    currentActivityTitle,
    addActivity,
    removeActivity,
    initActivities,
    setCurrentActivityId,
    editActivity,
  } from './../store/activities.js';
  import { fly } from 'svelte/transition';
  import { askConfirmation } from '../store/confirmation.js';

  let isAddingModalActive = false;
  let isEditingModalActive = false;
  let errorMessage = '';
  initActivities();

  function add(event) {
    const activity = addActivity(event.detail);

    if (activity) {
      setCurrentActivityId(activity.id);
      isAddingModalActive = false;
    } else {
      errorMessage = 'This activity is already exist';
    }
  }

  function edit(event) {
    const activityTitle = event.detail;
    const isSameActivityNameExist =
      $activitiesArr
        .find(activity => (
          activity.title == activityTitle) && activity.id != $currentActivityId
        );

    if (activityTitle && !isSameActivityNameExist) {
      editActivity($currentActivityId, activityTitle);
      isEditingModalActive = false;
    } else {
      errorMessage = 'This activity is already exist';
    }
  }
  
  function handleActivityClick(activity) {
    if ($currentActivityId === activity.id) {
      isEditingModalActive = true;
    } else {
      setCurrentActivityId(activity.id);
    }
  }
</script>

<div
  class="activities"
  class:list="{!$settings.showActivitiesAsCloud}"
>
  {#each $activitiesArr as activity}
    <div class="button-wrapper">
      <CustomButton
        on:click="{() => {
          handleActivityClick(activity);
        }}"
        active="{$currentActivityId === activity.id}"
      >
        {activity.title}
      </CustomButton>
    </div>
  {/each}
  <div class="button-wrapper">
    <CustomButton
      on:click="{() => {
        isAddingModalActive = true;
      }}"
    >
      +
    </CustomButton>
  </div>
</div>
<TextModal
  buttonText="{$_('add')}"
  active="{isAddingModalActive}"
  customClose
  on:message="{add}"
  on:close="{() => {
    isAddingModalActive = false;
  }}"
  bind:errorMessage
  title="{$_('adding_activity')}"
/>
<TextModal
  buttonText="{$_('edit')}"
  active="{isEditingModalActive}"
  customClose
  on:message="{edit}"
  on:close="{() => {
    isEditingModalActive = false;
  }}"
  on:secondary="{ async () => {
    if (await askConfirmation()) {
      removeActivity($currentActivityId);
      isEditingModalActive = false;
    };
  }}"
  bind:errorMessage
  inputMessage="{$currentActivityTitle}"
  secondaryButtonText="{$_('remove')}"
  title="{$_('editing_activity')}"
/>

<style lang="scss">
  .activities {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 50px;
    &.list {
      display: block;
      padding-left: 68px;
    }
    .button-wrapper {
      padding-top: 15px;
      position: relative;
    }
  }
</style>
