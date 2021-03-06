# Rionite

Реактивная обёртка над [custom-elements](https://www.w3.org/TR/custom-elements/).

## Установка

```
npm install cellx rionite --save
```

### Пример

```html
<hello-user name="Matroskin"></hello-user>

<script src="./node_modules/cellx/dist/cellx.js"></script>
<script src="./node_modules/rionite/dist/Rionite-with-polyfills.js"></script>
<script>

Rionite.Component.extend('hello-user', {
	Static: {
		props: {
			name: String
		},

		template: 'Hello, {props.name}!'
	},

    elementAttached: function() {
        // Сработает при появлении элемента `<hello-world>` в документе.
        // `this.element` — ссылка на появившийся элемент.
        // Отличное место для добавления обработчиков событий.
    },

    elementDetached: function() {
        // Сработает при удалении элемента `<hello-world>` из документа.
        // Не забыть снять добавленные обработчики событий.
    }
});

</script>
```

Можно использовать ES.Next синтаксис:

```js
import { Component, registerComponent } from 'rionite';

export default class HelloUser extends Component {
	static template = 'Hello, {props.name}!';

    static elementIs = 'hello-user';
	static props = {
        name: String
    };

    elementAttached() {}
    elementDetached() {}
}

// Не забыть зарегистрировать компонент.
registerComponent(HelloUser);
```

Элемент в приведённом примере отрендерится в следующий вид:
```html
<hello-user name="Matroskin" class="hello-user">Hello, Matroskin!</hello-user>
```

Имя тега продублировалось в css-классе элемента, это необходимо для наследования стилей — имя тега элемента у наследуемого компонента будет другим, но оба имени добавятся в css-класс элемента:
```html
<hello-super-user name="Matroskin" class="hello-user hello-super-user">Hello, Matroskin!</hello-super-user>
```
Таким образом стили элемента родительского компонента применятся и к элементу наследуемого компонента. В дальнейшем можно доопределить их:
```css
.hello-super-user {
    & {
        color: red;
    }

    & .hello-user__some-inner-element {
        font-width: bold;
    }
}
```

Стили элемента лучше назначать на css-класс элемента. На тег элемента обычно назначаются стили которые должны применяться к нему пока он не отрендерился, например, для скрытия передаваемого содержимого:
```html
<style>
super-select {
    display: none;
}

.super-select {
    display: inline-block;
}
</style>

<super-select>
    <super-select-option>1</super-select-option>
    <super-select-option>2</super-select-option>
    <super-select-option>3</super-select-option>
</super-select>
```

В статическом свойстве `props` задаётся объект-объявление возможных атрибутов элемента. В качестве значений объекта можно указать тип из следующих возможных: `Boolean`, `Number`, `String` и `Object`. Также можно указать значение по-умолчанию, тип будет вычислен из него:
```html
<hello-user></hello-user>

<script>

Rionite.Component.extend('hello-user', {
	Static: {
		props: {
			name: 'Anonymous'
		},

		template: 'Hello, {props.name}!'
	}
});

</script>
```
Элемент в примере отрендерится в следующий вид:
```html
<hello-user class="hello-user">Hello, Anonymous!</hello-user>
```

Статическое свойство `props` отражается на одноимённое свойство экземпляра компонента, в нём будет объект со значениями объявленных атрибутов, приведёнными к указанному типу.  
Свойство `props.content` будет фрагментом документа, в который перенесётся изначально переданное элементу содержимое. В дальнейшем оно чаще всего используются элементом `<rt-content>`:
```js
<super-button>123</super-button>

<script>

Rionite.Component.extend('super-button', {
	Static: {
		template: '<button><rt-content/></button>'
	}
});

</script>
```
Элемент в примере отрендерится в следующий вид:
```html
<super-button class="super-button"><button><rt-content>123</rt-content></button></super-button>
```

Элементу `<rt-content>` можно указать селектор по которому он отберёт содержимое для вывода. Если по селектору никаких элементов нет, то `<rt-content>` отрендерит собственное содержимое:
```js
<super-select>
    <super-select-option>1</super-select-option>
    <super-select-option>2</super-select-option>
    <super-select-option>3</super-select-option>
</super-select>

<script>

Rionite.Component.extend('super-select', {
	Static: {
		template: `
            <rt-content select="super-button">
                <super-button>{selectedValues}</super-button>
            </rt-content>

            <rt-content select="super-dropdown, super-popover">
                <super-dropdown>
                    <rt-content select="super-select-option"/>
                </super-dropdown>
            </rt-content>
        `
	}
});

</script>
```

Конструкции вида `{propertyName}` — это привязки данных — биндинги. Они будут автоматически обновляться в разметке при изменении соответствующих свойств. Сами свойства для этого должно быть реактивным и создаваться с помощью [cellx]()-а:
```html
<simple-counter></simple-counter>

<script>

Rionite.Component.extend('simple-counter', {
	Static: {
		template: `
            <div>value: {value}</div>
            <button rt-click="onButtonClick">value++</button>
        `
	},

    initialize() {
        cellx.define(this, {
            value: 0
        });
    },

    onButtonClick() {
        this.value++;
    }
});

</script>
```

Свойства в `props` тоже реактивные, при изменении значения атрибута разметка будет обновляться в местах где они использованы. При записи в них будет обновляться и разметка и значение атрибута.

Реактивные свойства могут вычислятся из других реактивных свойств и будут автоматически обновляться при изменении исходных:
```js
var User = cellx.EventEmitter.extend({
    constructor: function(name, birthdate) {
        cellx.define(this, {
            name: name,
            birthdate: birthdate,

            // Вычисляемое свойство, при записи в `someUser.birthdate` обновится автоматически.
            age: function() {
                return birthdateToAge(this.birthdate);
            }
        });
    }
});

var someUser = new User('Matroskin', '05/03/1986');

Rionite.Component.extend('user-card', {
    Static: {
        // Наблюдаемое и вычисляемое свойства используются в шаблоне.
        template: `
            <x-modal shown="{ageLess18}">
                Привет, {user.name}! Кажется вам ещё нет 18 лет.
            </x-modal>
        `
    },

    initialize: function() {
        cellx.define(this, {
            user: someUser,

            // Ещё одно вычисляемое свойство.
            ageLess18: function() {
                return this.user.age < 18;
            }
        });
    }
});

// Вычисляет возраст по дате рождения.
function birthdateToAge(birthdate) {
    birthdate = new Date(birthdate);
    var now = new Date();
    var age = now.getFullYear() - birthdate.getFullYear();
    return now.setFullYear(1972) < birthdate.setFullYear(1972) ? age - 1 : age;
}
```

Тоже самое в ES.Next синтаксисе с использованием модуля [cellx-decorators]():
```js
import { EventEmitter } from 'cellx';
import { observable, computed } from 'cellx-decorators';
import { Component, registerComponent } from 'rionite';

class User extends EventEmitter {
    @observable name = void 0;
    @observable birthdate = void 0;

    @computed age = function() {
        return birthdateToAge(this.birthdate);
    };

    constructor(name, birthdate) {
        this.name = name;
        this.birthdate = birthdate;
    }
}

let someUser = new User('Matroskin', '05/03/1986');

class UserCard extends Component {
	static template = `
        <x-modal shown="{ageLess18}">
            Привет, {user.name}! Кажется вам ещё нет 18 лет.
        </x-modal>
    `;

    static elementIs = 'user-card';

    @observable user = null;

    @computed ageLess18 = function() {
        return this.user.age < 18;
    };

    initialize() {
        this.user = someUser;
    }
}

registerComponent(UserCard);
```

Выражение биндинга может содержать символ `?` для проверки существования свойства:
```js
static template = `{user?.friends?.length}`;
```

Для управления потоком вычисления в шаблоне используются компоненты `rt-if-then`, `rt-if-else` и `rt-repeat`.

TODO:
- formatters
- больше про `rt-if-then`, `rt-if-else` и `rt-repeat` (strip)
- callbacks и `movedElement`
- удаление атрибута биндингом
- component vs element
- `assets`

## Обработка событий элементов

`Rionite` позволяет добавлять обработчики событий элементов в декларативном стиле:

```js
Rionite.Component.extend('simple-counter', {
	Static: {
		template: `
            <div>value: {value}</div>
            <button rt-click="onButtonClick">value++</button>
        `
	},

    onButtonClick() {
        this.value++;
    }
});
```

Можно добавлять обработчики на всплывающие события:

```js
return `
    <div>
        <input type="text">
        <input type="text">
    </div>
`;
```

В том числе на события компонентов:

```js
return `
    <div>
        <x-foo></x-foo>
        <x-foo rt-component-baz="onFooBaz"></x-foo>
    </div>
`;
```

## Контроль памяти

### Component#listenTo

Добавляет обработчик собития, который будет автоматически снят при очистке (`dispose`) компонента.  
Следующие два примера равносильны:

```js
Rionite.Component.extend('x-example', {
	ready: function() {
    	this.onDocumentScroll = this.onDocumentScroll.bind(this);
    },

    elementAttached: function() {
        document.addEventListener('scroll', this.onDocumentScroll);
    },

    elementDetached: function() {
        document.removeEventListener('scroll', this.onDocumentScroll);
    }
});
```

```js
Rionite.Component.extend('x-example', {
    elementAttached: function() {
        this.listenTo(document, 'scroll', this.onDocumentScroll);
    }
});
```

Можно передать объект, ключи которого будут типами событий, а значения — обработчиками:

```js
this.listenTo(document, {
    mousedown: this.onDocumentMouseDown,
    mouseup: this.onDocumentMouseUp
});
```

Возвращает объект с методом `stop`, при вызове которого обработчик будет снят (если один `listenTo` добавил сразу несколько обработчиков, то `stop` снимет их все).

### Component#setTimeout

Устанавливает таймер, который будет автоматически снят при очистке (`dispose`) компонента (в случае если он ещё не отработал).  
Следующие два примера равносильны:

```js
Rionite.Component.extend('x-example', {
    _timerId: null,

    elementAttached: function() {
        this._timerId = setTimeout(() => {
            this._timerId = null;
            this.onTimer();
        }, 10000);
    },

    elementDetached: function() {
        if (this._timerId) {
            clearTimeout(this._timerId);
        }
    }
});
```

```js
Rionite.Component.extend('x-example', {
    elementAttached: function() {
        this.setTimeout(this.onTimer, 10000);
    }
});
```

Возвращает объект с методом `clear`, при вызове которого таймер будет снят.

### Component#setInterval

Аналогично с `Component#setTimeout`.

## Передача сигналов между компонентами

Сложное взаимодействие между несколькими компонентами обычно делается через модель приложения, но простейшее взаимодействие, видящих друг-друга напрямую компонентов, обычно допустимо и удобнее делать без использования модели.

### Component#emit

Создаёт всплывающее событие на компоненте, что позволяет отправить сигнал от компонента-потомка к компонентам-предкам.

#### Пример

```js
<x-parent></x-parent>

<script>

Rionite.Component.extend('x-parent', {
    renderInner: function() {
        return `
            <x-child child-id="1"></x-child>
            <x-child child-id="2"></x-child>
        `;
    },

    elementAttached: function() {
        this.listenTo(this, 'foo', this.onChildFoo);
    },

    onChildFoo: function(evt) {
        console.log(evt.childId);
    }
});

Rionite.Component.extend('x-child', {
	Static: {
    	props: {
        	childId: String
        }
    },

    elementAttached: function() {
        this.setInterval(function() {
            this.emit({
                type: 'foo',
                childId: this.props.childId
            });
        }, 1000);
    }
});

</script>
```
