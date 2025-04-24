<template>
  <div class="region-selection">
    <div class="selection-header">
      <h2>Wählen Sie eine Region</h2>
      <p>Wählen Sie die Region aus, in der Sie nach Immobilien suchen möchten</p>
    </div>

    <div class="regions-grid">
      <div
        v-for="region in regions"
        :key="region.name"
        class="region-card"
        :class="{ selected: isSelected(region.name) }"
        @click="toggleRegion(region.name)"
      >
        <div class="region-image">
          <img :src="region.image" :alt="region.name" />
        </div>
        <div class="region-info">
          <h3>{{ region.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegionSelection",
  props: {
    regions: {
      type: Array,
      required: true,
    },
    selectedRegions: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    isSelected(regionName) {
      return this.selectedRegions.includes(regionName);
    },
    toggleRegion(regionName) {
      const newSelection = [...this.selectedRegions];
      const index = newSelection.indexOf(regionName);

      if (index === -1) {
        newSelection.push(regionName);
      } else {
        newSelection.splice(index, 1);
      }

      this.$emit("update:selectedRegions", newSelection);
      this.$emit("region-selected", regionName);
    },
  },
};
</script>

<style scoped>
.region-selection {
  width: 100%;
  margin-bottom: 40px;
}

.selection-header {
  text-align: center;
  margin-bottom: 30px;
}

.selection-header h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.selection-header p {
  color: #666;
  font-size: 14px;
}

.regions-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.region-card {
  width: 220px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.region-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.region-card.selected {
  border-color: #3490dc;
}

.region-image {
  height: 140px;
  overflow: hidden;
}

.region-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.region-info {
  padding: 15px;
  background-color: white;
}

.region-info h3 {
  margin: 0;
  font-size: 18px;
  text-align: center;
}
</style>