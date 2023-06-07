import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import DatePickerIOS from '@react-native-community/datetimepicker';

const UIPICKER_HEIGHT = 216;

class CollapsibleDatePickerIOS extends React.Component {
  constructor(props) {
    super(props);
    this._onDateChange = this.onDateChange.bind(this);
    this._onPress = this.onPress.bind(this);
    this.state = {
      isCollapsed: true,
      height: new Animated.Value(0),
    };
  }

  onDateChange(_, value) {
    this.props.locals.onChange(value);
  }

  onPress() {
    const locals = this.props.locals;

    let animationConfig = {
      duration: 200,
    };

    this.state.height,
      Object.assign(
        {
          toValue: this.state.isCollapsed ? UIPICKER_HEIGHT : 0,
        },
        animationConfig
      );

    this.setState({ isCollapsed: !this.state.isCollapsed });
    if (typeof locals.onPress === 'function') {
      locals.onPress();
    }
  }

  render() {
    const locals = this.props.locals;
    const stylesheet = locals.stylesheet;
    let touchableStyle = stylesheet.dateTouchable.normal;
    let datepickerStyle = stylesheet.datepicker.normal;
    let dateValueStyle = stylesheet.dateValue.normal;
    if (locals.hasError) {
      touchableStyle = stylesheet.dateTouchable.error;
      datepickerStyle = stylesheet.datepicker.error;
      dateValueStyle = stylesheet.dateValue.error;
    }

    if (locals.disabled) {
      touchableStyle = stylesheet.dateTouchable.notEditable;
    }

    let formattedValue = locals.value
      ? locals.mode === 'date'
        ? locals.value.toDateString()
        : locals.mode === 'time'
        ? locals.value.toTimeString()
        : locals.value.toISOString()
      : '';
    if (!formattedValue) {
      formattedValue =
        locals.config && locals.config.defaultValueText
          ? locals.config.defaultValueText
          : `Tap here to select a ${locals.mode}`;
    }
    const height = this.state.isCollapsed ? 0 : UIPICKER_HEIGHT;
    return (
      <View>
        <TouchableOpacity
          style={touchableStyle}
          disabled={locals.disabled}
          onPress={this._onPress}
        >
          <Text style={dateValueStyle}>{formattedValue}</Text>
        </TouchableOpacity>
        <DatePickerIOS
          display={'spinner'}
          mode={locals.mode}
          accessibilityLabel={locals.label}
          value={locals.value || new Date()}
          maximumDate={locals.maximumDate}
          minimumDate={locals.minimumDate}
          minuteInterval={locals.minuteInterval}
          onChange={this._onDateChange}
          timeZoneOffsetInMinutes={locals.timeZoneOffsetInMinutes}
          style={[datepickerStyle, { height: height }]}
        />
      </View>
    );
  }
}

CollapsibleDatePickerIOS.propTypes = {
  locals: PropTypes.object.isRequired,
};

function datepicker(locals) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  const label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  const help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  const error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion='polite' style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  return (
    <View style={formGroupStyle}>
      {label}
      {help}
      <CollapsibleDatePickerIOS locals={locals} />
      {error}
    </View>
  );
}

module.exports = datepicker;
