import { ISettingRegistry } from '@jupyterlab/coreutils';

import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { classes } from 'typestyle';

import {
  stagedCommitButtonDisabledStyle,
  stagedCommitButtonReadyStyle,
  stagedCommitButtonStyle,
  stagedCommitMessageStyle,
  stagedCommitStyle,
  textInputStyle
} from '../style/BranchHeaderStyle';

export interface ICommitBoxProps {
  hasFiles: boolean;
  commitFunc: (message: string) => Promise<void>;
  settings: ISettingRegistry.ISettings;
}

export interface ICommitBoxState {
  /**
   * Commit message
   */
  value: string;
}

export class CommitBox extends React.Component<
  ICommitBoxProps,
  ICommitBoxState
> {
  constructor(props: ICommitBoxProps) {
    super(props);
    this.state = {
      value: ''
    };
  }

  /** Prevent enter key triggered 'submit' action during commit message input */
  onKeyPress(event: any): void {
    if (event.which === 13) {
      event.preventDefault();
      this.setState({ value: this.state.value + '\n' });
    }
  }

  /** Initalize commit message input box */
  initializeInput = (): void => {
    this.setState({
      value: ''
    });
  };

  /** Handle input inside commit message box */
  handleChange = (event: any): void => {
    this.setState({
      value: event.target.value
    });
  };

  /** Update state of commit message input box */
  commitButtonStyle = (hasStagedFiles: boolean) => {
    if (hasStagedFiles) {
      if (this.state.value.length === 0) {
        return classes(stagedCommitButtonStyle, stagedCommitButtonReadyStyle);
      } else {
        return stagedCommitButtonStyle;
      }
    } else {
      return classes(stagedCommitButtonStyle, stagedCommitButtonDisabledStyle);
    }
  };

  render() {
    return (
      <form
        className={stagedCommitStyle}
        onKeyPress={event => this.onKeyPress(event)}
      >
        <TextareaAutosize
          className={classes(textInputStyle, stagedCommitMessageStyle)}
          disabled={!this.props.hasFiles}
          minRows={2}
          onChange={this.handleChange}
          placeholder={this._placeholder()}
          value={this.state.value}
        />
        <input
          className={this.commitButtonStyle(this.props.hasFiles)}
          type="button"
          title="Commit"
          disabled={!(this.props.hasFiles && this.state.value)}
          onClick={() => {
            this.props.commitFunc(this.state.value);
            this.initializeInput();
          }}
        />
      </form>
    );
  }

  protected _placeholder = (): string => {
    if (this.props.settings.composite['simpleStaging']) {
      return this.props.hasFiles
        ? 'Input message to commit selected changes'
        : 'Select changes to enable commit';
    } else {
      return this.props.hasFiles
        ? 'Input message to commit staged changes'
        : 'Stage your changes before commit';
    }
  };
}
