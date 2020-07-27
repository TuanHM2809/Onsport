<template>
  <aside class="pullquote  pullquote--standard">
    <blockquote>
      <p class="pullquote__quote">Can we win the Europa League? Absolutely, 100%</p>
      <p class="pullquote__author">Daniel Kindberg</p>
    </blockquote>
  </aside>
</template>
<style scoped>
.pullquote.pullquote--standard {
  float: left;
}
.pullquote--standard {
  width: 100%;
  float: right;
  margin-bottom: 15px;
  color: #262626;
  margin: 20px 20px 30px 0;
}
.pullquote > blockquote {
  color: #8c8c8c;
  font-weight: 400;
  position: relative;
  margin: 0;
}
.pullquote > blockquote:before {
  display: block;
  height: 35px;
  line-height: 0.8;
  content: "\f10d";
  font-family: FontAwesome;
  font-size: 36px;
}
.pullquote__quote {
  font-style: normal;
  margin-bottom: 1rem;
  
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  font-size: 20px;
  line-height: 1.6;
}
.pullquote__author {
  color: #bfbfbf;
  font-weight: 300;
  
  font-weight: 700;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  line-height: 1.4285714286;
}

@media (min-width: 640px) {
  .pullquote {
    margin-left: 20px;
    width: 300px;
  }
  .pullquote > blockquote:before {
    height: 40px;
    line-height: 0.5;
    font-size: 52px;
    font-size: 3.4666666667rem;
  }
  .pullquote__quote {
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    font-size: 20px;
    line-height: 1.3;
  }
  .pullquote__author {
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
    font-size: 18px;
    font-size: 1.2rem;
    line-height: 1.3333333333;
  }
}
</style>
