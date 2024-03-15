package types

import "time"

type Error struct {
	Message string `json:"message"`
}

type Repository struct {
	ID              float64   `json:"id"`
	TargetCommitish string    `json:"target_commitish"`
	PublishedAt     time.Time `json:"published_at"`
	ZipballUrl      string    `json:"zipball_url"`
	UploadUrl       string    `json:"upload_url"`
	NodeId          string    `json:"node_id"`
	Url             string    `json:"url"`
	AssetsUrl       string    `json:"assets_url"`
	TagName         string    `json:"tag_name"`
	Name            string    `json:"name"`
	Draft           bool      `json:"draft"`
	Prerelease      bool      `json:"prerelease"`
	CreatedAt       time.Time `json:"created_at"`
	Body            string    `json:"body"`
	HtmlUrl         string    `json:"html_url"`
	Assets          []Asset   `json:"assets"`
	TarballUrl      string    `json:"tarball_url"`
	Error
}

type Asset struct {
	NodeId             string      `json:"node_id"`
	Uploader           Uploader    `json:"uploader"`
	Url                string      `json:"url"`
	State              string      `json:"state"`
	DownloadCount      float64     `json:"download_count"`
	UpdatedAt          time.Time   `json:"updated_at"`
	Name               string      `json:"name"`
	Label              interface{} `json:"label"`
	ContentType        string      `json:"content_type"`
	Size               float64     `json:"size"`
	BrowserDownloadUrl string      `json:"browser_download_url"`
	ID                 float64     `json:"id"`
	CreatedAt          time.Time   `json:"created_at"`
}

type Uploader struct {
	GistsUrl          string  `json:"gists_url"`
	SiteAdmin         bool    `json:"site_admin"`
	Login             string  `json:"login"`
	HtmlUrl           string  `json:"html_url"`
	FollowingUrl      string  `json:"following_url"`
	Type              string  `json:"type"`
	AvatarUrl         string  `json:"avatar_url"`
	StarredUrl        string  `json:"starred_url"`
	SubscriptionsUrl  string  `json:"subscriptions_url"`
	OrganizationsUrl  string  `json:"organizations_url"`
	ReposUrl          string  `json:"repos_url"`
	EventsUrl         string  `json:"events_url"`
	ReceivedEventsUrl string  `json:"received_events_url"`
	ID                float64 `json:"id"`
	NodeId            string  `json:"node_id"`
	GravatarId        string  `json:"gravatar_id"`
	Url               string  `json:"url"`
	FollowersUrl      string  `json:"followers_url"`
}
