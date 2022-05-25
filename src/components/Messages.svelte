<script>
  import { fade } from 'svelte/transition';
  import { notificationsArr, removeMessage } from '../store/appNotifications.js'
</script>

<div class="messages">
  {#each $notificationsArr as notification}
    <div
      class="message"
      transition:fade
    >
      { notification.message }
      <div
        class="close"
        on:click="{ removeMessage(notification.key) }"
      ></div>
    </div>  
  {/each}
</div>

<style lang="scss">
  .messages {
    position: fixed;
    left: 10px;
    bottom: 10px;

    .message {
      position: relative;
      padding: 10px 25px 10px 15px;
      width: 200px;
      border-radius: 3px;
      background-color: var(--color-main-bg-soft);
      color: var(--color-text);
      letter-spacing: 1px;
      margin-bottom: 15px;
      font-size: 11px;
      line-height: 1.2;
    }

    .close {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 10px;
      height: 10px;
      user-select: none;
      color: #aaa;
      transition: opacity .2s;
      cursor: pointer;
      opacity: .6;
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        rotate: 45deg;
        background-color: #fff;
      }
      &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      &:hover {
        opacity: 1;
      }
    }
  }
</style>
