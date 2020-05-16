<script>
  import { _ } from 'svelte-i18n';
  import TextModal from './TextModal.svelte';
  import DefaultButton from './DefaultButton.svelte';
  import {
    tags,
    tagsArr,
    currentTag,
    addTag,
    removeTag,
    initTags,
    setCurrentTag,
  } from './../store/tags.js';
  import { fly } from 'svelte/transition';

  let isAddingModalActive = false;
  let tagActive = '';
  initTags();

  function add(event) {
    addTag(event.detail);
  }

  function openAddingModal() {
    isAddingModalActive = true;
  }
  console.log($tagsArr);
  function setCurrentTagLocal(tag) {
    setCurrentTag(tag);
    tagActive = '';
  }
</script>

<div class="tags">
  {#each $tagsArr as tag}
    <div
      class="button-wrapper"
      on:mouseover="{() => {
        $currentTag[tag.key] ? (tagActive = '') : (tagActive = tag.key);
      }}"
      on:mouseout="{() => {
        tagActive = '';
      }}"
    >
      <DefaultButton
        on:click="{() => {
          setCurrentTagLocal({ [tag.key]: tag.text });
        }}"
        active="{Boolean($currentTag[tag.key])}"
      >
        {tag.text}
      </DefaultButton>
      {#if tagActive === tag.key}
        <div
          class="remove"
          transition:fly="{{ y: -50, duration: 400 }}"
          on:click="{() => {
            removeTag(tag.key);
          }}"
        >
          {$_('remove')}
        </div>
      {/if}
    </div>
  {/each}
  <div class="button-wrapper">
    <DefaultButton on:click="{openAddingModal}">+</DefaultButton>
  </div>
</div>
<TextModal
  buttontext="{$_('add')}"
  active="{isAddingModalActive}"
  on:message="{add}"
  on:close="{() => {
    isAddingModalActive = false;
  }}"
  title="{$_('adding_activity')}"
/>

<style lang="scss">
  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .button-wrapper {
    padding-top: 15px;
    position: relative;
  }

  .remove {
    opacity: 0.5;
    transition: 0.2 opacity;
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 2px;
    font-size: 10px;
    transform: translateX(-50%);
    color: #ccc;
    transition: 0.8 opacity;
    &:hover {
      opacity: 1;
    }
  }
</style>
