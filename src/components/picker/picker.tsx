import * as React from "react";

import { EmojiData, FriendlyEmojiData } from "../../types";
import { emojiList } from "../../lib/emoji-list";
import { EmojiCategorySection } from "../emoji-category-section/emoji-category-section";
import { categories, Category } from "../../lib/categories";
import { makeRows } from "../../lib/make-rows";
import { searchEmojis } from "../../lib/search";
import { toFriendlyEmojiData } from "../../lib/converter";
import { CategorySelector } from "../category-selector/category-selector";
import { Search } from "../search/search";
import {
  addToFrequentlyUsed,
  getFrequentlyUsed,
  FREQUENTLY_USED,
} from "../../lib/frequently-used";

import "./picker-styles.scss";

type Props = {
  placeHolderSearchText?: string;
  search?: boolean;
  categorySelector?: boolean;
  categories?: Array<Category>;
  idPrefix?: string;
  frequentlyUsed?: boolean;
  categoryNames?: boolean;
  onClick: (value: FriendlyEmojiData) => void;
};

type State = {
  searchString: string;
  frequentlyUsed: Array<EmojiData>;
};

export class Picker extends React.Component<Props, State> {
  state: State = {
    searchString: "",
    frequentlyUsed: getFrequentlyUsed(),
  };

  static defaultProps = {
    categories: categories,
    idPrefix: "",
  };

  setSeachValue = (searchString: string) => {
    this.setState({
      searchString,
    });
  };

  shouldComponentUpdate(_, nextState: State) {
    if (nextState.searchString !== this.state.searchString) {
      return true;
    }

    if (nextState.frequentlyUsed.length !== this.state.frequentlyUsed.length) {
      return true;
    }

    return false;
  }

  doSearch = (value: string) => {
    if (value === "") {
      return {
        ...emojiList,
        ...(this.props.frequentlyUsed
          ? { [FREQUENTLY_USED]: this.state.frequentlyUsed }
          : {}),
      };
    }

    return searchEmojis(
      value,
      {
        ...emojiList,
        ...(this.props.frequentlyUsed
          ? { [FREQUENTLY_USED]: this.state.frequentlyUsed }
          : {}),
      },
      this.props.categories!
    );
  };

  onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setSeachValue(e.target.value.trim());
  };

  renderSearch() {
    if (!this.props.search) {
      return false;
    }

    return (
      <Search
        placeHolderText={this.props.placeHolderSearchText}
        onChange={this.onSearchChange}
      />
    );
  }

  onEmojiClick = (data: EmojiData) => {
    if (this.props.frequentlyUsed) {
      this.setState({
        frequentlyUsed: addToFrequentlyUsed(data),
      });
    }
    this.props.onClick(toFriendlyEmojiData(data));
  };

  renderCategories() {
    const list = this.doSearch(this.state.searchString.trim());

    return (
      <div
        className="categories"
        style={{
          height: `calc(100% - ${this.getHeight()}px)`,
        }}
      >
        {this.props.categories!.map((category) => {
          if (
            !Array.isArray(list[category.category]) ||
            list[category.category].length === 0
          ) {
            return null;
          }

          return (
            <EmojiCategorySection
              key={category.category}
              category={category}
              categoryNames={this.props.categoryNames!}
              list={makeRows(list[category.category])}
              idPrefix={this.props.idPrefix}
              onClick={this.onEmojiClick}
            />
          );
        })}
      </div>
    );
  }

  onCategoryClick = (category: Category) => {
    const element = document.getElementById(
      `${this.props.idPrefix}${category.category}`
    );
    if (element) {
      element.scrollIntoView();
    }
  };

  renderCategorySelector() {
    if (!this.props.categorySelector) {
      return null;
    }

    return (
      <CategorySelector
        categories={this.props.categories!}
        onClick={this.onCategoryClick}
      />
    );
  }

  getHeight() {
    if (this.props.search && this.props.categorySelector) {
      return 78;
    }

    if (this.props.categorySelector || this.props.search) {
      return 40;
    }

    return 0;
  }

  render() {
    return (
      <div className="local-emoji-picker" lang="en">
        <div className="controls">
          {this.renderCategorySelector()}
          {this.renderSearch()}
        </div>
        {this.renderCategories()}
      </div>
    );
  }
}
