<script>
  import { _ } from 'svelte-i18n';
  import TextModal from './modals/TextModal.svelte';
  import DefaultButton from './form-elements/DefaultButton.svelte';
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

  let isAddingModalActive = false;
  let isEditingModalActive = false;
  let activityActiveId = '';
  let errormessage = '';
  initActivities();

  function add(event) {
    const activity = addActivity(event.detail);

    if (activity) {
      setCurrentActivityIdLocal(activity.id);
      isAddingModalActive = false;
    } else {
      errormessage = 'This activity is already exist';
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
      errormessage = 'This activity is already exist';
    }
  }
  
  function handleActivityClick(activity) {
    if ($currentActivityId === activity.id) {
      isEditingModalActive = true;
    } else {
      setCurrentActivityIdLocal(activity.id);
    }
  }

  function setCurrentActivityIdLocal(id) {
    setCurrentActivityId(id);
    activityActiveId = '';
  }

  function handleFocus(activity) {
    $currentActivityId === activity.id
      ? (activityActiveId = '')
      : (activityActiveId = activity.id);
  }
</script>

<div class="activities">
  {#each $activitiesArr as activity}
    <div
      class="button-wrapper"
      on:mouseover="{() => {
        handleFocus(activity);
      }}"
      on:focus="{() => {
        handleFocus(activity);
      }}"
      on:mouseout="{() => {
        activityActiveId = '';
      }}"
      on:blur="{() => {
        activityActiveId = '';
      }}"
    >
      <DefaultButton
        on:click="{() => {
          handleActivityClick(activity);
        }}"
        active="{$currentActivityId === activity.id}"
      >
        {activity.title}
      </DefaultButton>
      {#if activityActiveId === activity.id && activity.id !== $currentActivityId}
        <div
          class="remove"
          transition:fly="{{ y: -10, duration: 200 }}"
          on:click="{() => {
            removeActivity(activity.id);
          }}"
        >
          {$_('remove')}
        </div>
      {/if}
    </div>
  {/each}
  <div class="button-wrapper">
    <DefaultButton
      on:click="{() => {
        isAddingModalActive = true;
      }}"
    >
      +
    </DefaultButton>
  </div>
</div>
<TextModal
  buttontext="{$_('add')}"
  active="{isAddingModalActive}"
  customclose
  on:message="{add}"
  on:close="{() => {
    isAddingModalActive = false;
  }}"
  bind:errormessage
  title="{$_('adding_activity')}"
/>
<TextModal
  buttontext="{$_('edit')}"
  active="{isEditingModalActive}"
  customclose
  on:message="{edit}"
  on:close="{() => {
    isEditingModalActive = false;
  }}"
  bind:errormessage
  inputmessage="{$currentActivityTitle}"
  title="{$_('editing_activity')}"
/>

<style lang="scss">
  .activities {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 50px;
  }

  .button-wrapper {
    padding-top: 15px;
    position: relative;
  }

  .remove {
    opacity: .5;
    transition: .2 opacity;
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 2px;
    font-size: 10px;
    transform: translateX(-50%);
    color: var(--color-text-soft);
    transition: .8 opacity;
    &:hover {
      opacity: 1;
    }
  }
</style>
