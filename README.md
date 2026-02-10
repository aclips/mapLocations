# Map Locations 🗺️

Библиотека для отображения точек на карте с несколькими локациями и панелью управления.

---

## Особенности

- Несколько локаций (этажи, зоны, SVG-карты)  
- Добавление, удаление и перемещение точек  
- Режимы: редактирование и просмотр  
- Панель управления точками  

---

## Быстрый старт

<div class="map" id="MAP_ID"></div>
<div class="panel" id="PANEL"></div>

<script type="module">
import Map from './src/Map.js'
import Panel from './src/Panel.js'

const canEdit = false

let map = new Map('MAP_ID', {
    size: { width: 300, height: 500 },
    activeLocationId: 'floor_1',
    locations: [
        { id: 'floor_1', name: 'Этаж 1', image: './images/map_1.jpg', editable: canEdit, points: [
            { id: 1, label: 'Иван', image: './images/1.png', position: { x: 100, y: 100 } }
        ] }
    ]
})

let panel = new Panel('PANEL', map, {
    editable: canEdit,
    labels: { panelName: 'Пользователи', saveBtn: 'Сохранить', addUserBtn: 'Добавить' }
})
</script>

---

## API основные методы

**Map:**  
- changeLocation(id) — смена локации  
- getActiveLocation() — получить текущую локацию  

**Location:**  
- addPoint(point) / deletePoint(id) / movePoint(id, x, y)  
- moveToPoint(id) — переместиться к точке  
- setEditMode() / setViewMode()  

**Panel:**  
- setEditMode() / setViewMode()  

---

## Лицензия

MIT License
