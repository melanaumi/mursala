<template>
  <section class="section" id="root">
    <div class="container">
          <a class="button is-primary" @click="expandAll">
        Close All
      </a>

      <br />
      <br />

      <div class="columns is-multiline">
        <Accordion title="Test 1" @expand="expandAll">
          <p>Stuff 1</p>
        </Accordion>
        <Accordion title="Test 2" @expand="expandAll">
          <p>Stuff 2</p>
        </Accordion>
        <Accordion title="Test 3" @expand="expandAll">
          <p>Stuff 3</p>
        </Accordion>
        <Accordion title="Test 4" @expand="expandAll">
          <p>Stuff 4</p>
        </Accordion>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ArgonCollapse",
}

</script>

<style scoped>
.card {
  margin-bottom: 10px;
  width: 100%;
}
.card-header {
  cursor: pointer;
}
.icon {
  transform: rotate(180deg);
  transition: transform 150ms ease-out;
}
.card-content {
  transition: all 150ms ease;
}
.card.not-expanded .card-header .icon {
  transform: rotate(0deg);
}
.card-content {
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  height: 0;
  padding: 0;
}
</style>