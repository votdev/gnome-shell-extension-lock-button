/*
 * Copyright © 2015 Volker Theile
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the licence, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Volker Theile <votdev@gmx.de>
 */

const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;
const BoxPointer = imports.ui.boxpointer;

const ScreenSaverIface = '<node> \
<interface name="org.gnome.ScreenSaver"> \
<method name="Lock" /> \
</interface> \
</node>';
const ScreenSaverProxy = Gio.DBusProxy.makeProxyWrapper(ScreenSaverIface);

function ScreenSaver() {
    return new ScreenSaverProxy(Gio.DBus.session, 'org.gnome.ScreenSaver',
      '/org/gnome/ScreenSaver');
}

function init() {
    let me = this;
    me._system = Main.panel.statusArea['aggregateMenu']._system;
}

function enable() {
    let me = this;
    // Create the button.
    me._lockScreenAction = me._system._createActionButton(
      'changes-prevent-symbolic', _("Lock"));
    me._lockScreenAction.connect('clicked', Lang.bind(
      me, me._onLockScreenClicked));
    me._system._actionsItem.actor.add(me._lockScreenAction,
      { expand: true, x_fill: false });
    // Show the lock-button if the menu is opened.
    me._system.menu.connect('open-state-changed', Lang.bind(
      me, function(menu, open) {
        if (!open)
            return;
        me._lockScreenAction.visible = true;
    }));
}

function disable() {
    let me = this;
    if (me._lockScreenAction) {
        me._system._actionsItem.actor.remove_child(me._lockScreenAction);
        me._lockScreenAction = 0;
    }
}

function _onLockScreenClicked() {
    let me = this;
    let screenSaver = new ScreenSaver();
    me._system.menu.itemActivated(BoxPointer.PopupAnimation.NONE);
    Main.overview.hide();
    screenSaver.LockRemote();
}
