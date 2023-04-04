<template>
  <q-card-section class="row text-center">
    <q-card-section class="col text-h4 text-primary">
      {{  header || "welCome" }}
    </q-card-section>
    <q-list bordered>
      <q-item
        v-for="item in reversedItems"
        :key="item.id"
        @click="togglePurchased(item)"
        class="rounded-border"
        :class="{strikeout:item.purchased, priority:item.highPriority}"
        dense
        padding
        clickable
        v-ripple
      >
        <q-item-section>
          {{ item.label }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>

</template>

<script>
export default {
  name:"ShoppingList",
  title:"쇼핑 리스트",
  data(){
    return {
      header:"Shopping List App"

    }
    items : [
        { id: 1, label: "10 party hats", purchased: true, highPriority: false },
        { id: 2, label: "2 board games", purchased: true, highPriority: false },
        { id: 3, label: "20 cups", purchased: false, highPriority: true },
      ]
    },
  computed : {
    reversedItems(){
      return [...this.items].reverse();
    }
  },
  methods :{
    togglePurchased(item){
      item.purchased = !item.purchased;
    }
  }
}
</script>

<style>
.strikeout{
  text-decoration: line-through;
  color: #b8c2cc;
}
.priority{
  color: #de751f;
  font-weight: 600;
}
</style>
